const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
const dbpath = path.join(__dirname, "cricketTeam.db");
const db = null;

const initializedbandserver = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running");
    });
  } catch (e) {
    console.log("DB ERROR ${e.message}");
    process.exit(1);
  }
};
initializedbandserver();

///get books api
app.get("/players/", async (request, response) => {
  const sqquery = `
    SELECT * FROM cricket_team ORDER_BY player_id;`;
  const playersarray = await db.all(sqquery);
  response.send(playersarray);
});

///post book api
app.post("/players/", async (request, response) => {
  const cricketbody = request.body;
  const { player_name, jersey_number, role } = cricketbody;
  const addplayer = `
  INSERT INTO
   cricket_team (player_id, player_name, jersey_number, role)
   VALUES
   (
     ${player_name},${jersey_number}, ${role}
   );`;
  const bdresponse = await db.run(addplayer);
  const bookid = dbresponse.lastID;
  response.send("Player Added to Team");
});

//get book api
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const sqquerybook = `
    SELECT * FROM cricket_team WHERE player_id=${playerId};`;
  const book = await db.get(sqquerybook);
  response.send(book);
});

//update book api
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const cricketbody = request.body;
  const { player_name, jersey_number, role } = cricketbody;
  const addbook = `
  UPDATE cricket_team SET player_name='${player_name}',
  jersey_number='${jersey_number}', role='${role}'
  WHERE 
  player_Id=${playerId};`;
  await db.run(addbook);
  response.send("Player Details Updated");
});

//delete
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const delpl = `DELETE FROM cricket_team WHERE player_Id=${playerId};`;
  await db.run(delpl);
  response.send("Player Removed");
});

module.exports = app;
