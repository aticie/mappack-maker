// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

import { fstat, writeFileSync, createWriteStream } from "fs";
import { MapRequest } from "src/types/requests";
import JSZip from "jszip";

let OAuthTokenExpire = Date.now();
let OAuthAccessKey = "";

const OSU_CLIENT_ID = process.env.osu_client_id;
const OSU_CLIENT_SECRET = process.env.osu_client_secret;
const OSU_TOKEN_ENDPOINT = "https://osu.ppy.sh/oauth/token";
const OSU_MAP_ENDPOINT = "https://osu.ppy.sh/api/v2/beatmaps/";

const MAP_ENDPOINT = "https://chimu.moe/d/";

export const config = {
  api: {
    responseLimit: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let requestBody: MapRequest = req.body;

  if (req.method === "POST") {
    try {

      let mapList = requestBody.maps;
      console.log(`Map List: ${mapList}`, mapList.length);

      const allResponses: string[] = [];

      for (let mapId of mapList) {
        console.log(`Making request for ${mapId}`)
        const binary = await makeRequest(mapId, requestBody.isSetId);
        allResponses.push(binary);

        //Sleep function
        await new Promise((resolve) => setTimeout(resolve, 350));
      }

      console.log("All requests resolved");

      res.setHeader('Content-Type','application/zip, application/octet-stream')
      res.setHeader('Content-Disposition', 'attachment; filename=test.zip');
      await zipAllFiles(allResponses, res);

      return res.status(200);

    } catch (err) {
      console.log(err);
      return res.status(500);
    }
  } else if (req.method === "GET") {

  } else {
    return res.status(422);
  }
}

async function convertToSetID(beatmapId: string): Promise<string> {
  await fetchAccessToken();
  const osuRes = await axios.get(OSU_MAP_ENDPOINT + beatmapId, {
    headers: { Authorization: `Bearer ${OAuthAccessKey}` },
  });
  const osuBody = await osuRes.data;
  return osuBody.beatmapset_id;
}

async function fetchAccessToken(): Promise<string> {
  if (Date.now() > OAuthTokenExpire) {
    const accessTokenBody = {
      client_id: OSU_CLIENT_ID,
      client_secret: OSU_CLIENT_SECRET,
      grant_type: "client_credentials",
      scope: "public",
    };

    let resp = await axios
      .post(OSU_TOKEN_ENDPOINT, accessTokenBody)
      .catch((err: any) => console.log(err));
    let response_json = await resp?.data; // Fursum
    OAuthAccessKey = response_json?.access_token;
    OAuthTokenExpire += response_json?.expires_in;
  }

  return OAuthAccessKey;
}

async function makeRequest(beatmapId: string, isSetId?: boolean) {
  let setId = beatmapId;
  if (!isSetId) {
    setId = await convertToSetID(beatmapId);
  }
  let res = await axios.get(MAP_ENDPOINT + setId);
  let response_contents = res.data;
  return response_contents;
}

async function zipAllFiles(fileContents: string[], res:NextApiResponse) {
  let zip = new JSZip();
  fileContents.forEach((content, index) => {
    zip.file(`${index}.osz`, content);
  });
  zip.generateNodeStream({type: "nodebuffer"}).pipe(res)
  //.generateAsync({type: 'nodebuffer'})

}
