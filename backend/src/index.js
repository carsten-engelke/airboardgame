import saveGame from "./saveGame";

const replaceImageUrl = async ({ store }) => {
  console.log("Migrate images...");

  (await store.list("game")).forEach((game) => {
    if (!Array.isArray(game.board.migrations)) {
      game.board.migrations = [];
    }

    const from = "public.jeremiez.net/airboardgame/";
    const to = "public.jeremiez.net/ricochet/";

    if (game.board.migrations.includes("migrate_image_url")) {
      return;
    }
    game.items = game.items.map((item) => {
      if (item.type === "image") {
        const newItem = { ...item };
        if (newItem.content && newItem.content.includes(from)) {
          newItem.content = newItem.content.replace(from, to);
        }
        if (
          newItem.overlay &&
          newItem.overlay.content &&
          newItem.overlay.content.includes(from)
        ) {
          newItem.overlay = newItem.overlay.replace(from, to);
        }
        if (newItem.backContent && newItem.backContent.includes(from)) {
          newItem.backContent = newItem.backContent.replace(from, to);
        }
        return newItem;
      } else {
        return item;
      }
    });

    if (game.board.imageUrl && game.board.imageUrl.includes(from)) {
      game.board.imageUrl = game.board.imageUrl.replace(from, to);
    }

    game.board.migrations.push("migrate_image_url");

    store.update("game", game._id, game);
  });
};

export const main = async ({ store, functions }) => {
  // Add remote functions
  functions.saveGame = saveGame;
  functions.test = ({ store }) => {
    console.log("Test function call is a success", store);
  };
  // Declare store
  await store.createOrUpdateBox("game", { security: "readOnly" });
  await replaceImageUrl({ store });
  console.log("Setup loaded");
};

export default main;
