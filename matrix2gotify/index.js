const http = require("http");
const fs = require("fs");

const CONFIG_PATH = "/app/config.json";
const STORAGE_JSON_PATH = "/app/storage.json";

let config_cache = null;

const getConfig = () => {
  if (!config_cache) {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    const {
      MATRIX_HTTP_HOST,
      MATRIX_HTTP_PORT,
      GOTIFY_HTTP_HOST,
      GOTIFY_HTTP_PORT,
      MATRIX_ACCESS_TOKEN,
      GOTIFY_APP_TOKEN,
    } = config;
    config_cache = {
      MATRIX_HTTP_HOST,
      MATRIX_HTTP_PORT,
      GOTIFY_HTTP_HOST,
      GOTIFY_HTTP_PORT,
      MATRIX_ACCESS_TOKEN,
      GOTIFY_APP_TOKEN,
    };
  }
  return config_cache;
};
const getPersistentData = () => {
  const persistentData = JSON.parse(fs.readFileSync(STORAGE_JSON_PATH, "utf8"));
  return persistentData;
};
const getMatrixMessage = (cb) => {
  const { last_send_event_id, since_token } = getPersistentData();
  console.log("getMatrixMessage", since_token);
  const { MATRIX_HTTP_HOST, MATRIX_ACCESS_TOKEN, MATRIX_HTTP_PORT } =
    getConfig();
  http.get(
    since_token
      ? `http://${MATRIX_HTTP_HOST}:${MATRIX_HTTP_PORT}/_matrix/client/r0/sync?since=${since_token}`
      : `http://${MATRIX_HTTP_HOST}:${MATRIX_HTTP_PORT}/_matrix/client/r0/sync`,
    {
      headers: {
        Authorization: `Bearer ${MATRIX_ACCESS_TOKEN}`,
      },
    },
    (response) => {
      let datastr = "";

      // called when a data chunk is received.
      response.on("data", (chunk) => {
        datastr += chunk;
      });

      // called when the complete response is received.
      response.on("end", () => {
        const data = JSON.parse(datastr);
        // console.log(data);
        let new_since_token = data.next_batch;
        const me = data.presence.events[0].sender;
        let messages = {};
        let new_last_send_event_id = last_send_event_id;
        for (let roomid in data.rooms?.join || {}) {
          const room = data.rooms.join[roomid];
          let founded = !!since_token;
          for (let event of room.timeline.events) {
            // console.log(event);
            if (
              !!last_send_event_id &&
              !founded &&
              event.event_id !== last_send_event_id
            ) {
              continue;
            }
            if (
              !!last_send_event_id &&
              !founded &&
              event.event_id === last_send_event_id
            ) {
              founded = true;
            }
            if (event.type === "m.room.encrypted" && event.sender !== me) {
              if (messages[event.sender]) {
                messages[event.sender] = messages[event.sender] + 1;
              } else {
                messages[event.sender] = 1;
              }
              new_last_send_event_id = event.event_id;
            }
            savePersistentData({
              since_token: new_since_token,
              last_send_event_id: new_last_send_event_id,
            });
          }
        }
        cb(messages);
      });
    }
  );
};
const send2Gotify = (messages) => {
  const { GOTIFY_HTTP_HOST, GOTIFY_HTTP_PORT, GOTIFY_APP_TOKEN } = getConfig();
  for (let sender in messages) {
    const payload = JSON.stringify({
      title: `Matrix 新消息`,
      message: `发信人：${sender} ${messages[sender]} 条新消息`,
      priority: 5,
    });
    const options = {
      hostname: GOTIFY_HTTP_HOST,
      path: `/message?token=${GOTIFY_APP_TOKEN}`,
      method: "POST",
      port: GOTIFY_HTTP_PORT,
      headers: {
        "Content-Type": "application/json",
      },
    };
    const req = http.request(options, (res) => {
      console.log(`gotify 状态码: ${res.statusCode}`);
    });

    req.on("error", (error) => {
      console.error(error);
    });

    req.write(payload);
    req.end();
  }
};
const savePersistentData = ({ since_token, last_send_event_id }) => {
  const persistentData = {
    since_token,
    last_send_event_id,
  };
  // 保存数据到文件
  fs.writeFileSync(STORAGE_JSON_PATH, JSON.stringify(persistentData));
};
getMatrixMessage(send2Gotify);
