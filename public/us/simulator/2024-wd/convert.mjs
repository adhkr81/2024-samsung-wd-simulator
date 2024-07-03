import { writeFileSync, readFileSync } from "fs";

{
  /*
For scrolling screens on this one

vkrs -> new template data

scrolling preset 1 = "preset2"
scrolling preset 2 = "preset3"

*/
}

const vkrs_data = JSON.parse(
  readFileSync("./from-vkrs.json").toString()
).screens;

const keys = Object.keys(vkrs_data);

const new_data = {};

const renameFileRef = (str, scroll = false) => {
  if (str !== null) {
    return str
    .replace(`images/${scroll ? "scrolling" : "screens"}/`, "")
    .replace(".jpg", "");
  }
};

const roundNumber = (str) => Math.round(parseFloat(str));


for (const key of keys) {
  const new_key = renameFileRef(key);

  const is_scrolling = Boolean(vkrs_data[key].scrolling);
  if (is_scrolling) {
    const preset_name = vkrs_data[key].preset === 1 ? "preset2" :
    vkrs_data[key].preset === 2 ? "preset3" :
    vkrs_data[key].preset === 3 ? "preset4" :
    "unknown_preset";

    
    new_data[new_key] = {
      img_filename: new_key,
      preset: preset_name,
      model: "washer-and-dryer",
      buttons: vkrs_data[key].buttons.map((btn) => {
        const { width, height, top, left, target } = btn;
        return {
          width: roundNumber(width),
          height: roundNumber(height),
          x: roundNumber(left) - 125,
          y: roundNumber(top) - 17,
          target: renameFileRef(target),
        };
      }),
      back_button: { target: "" },
      scroll_area: {
        img_filename: renameFileRef(vkrs_data[key].scrolling.screen, true),
        buttons: vkrs_data[key].scrolling.buttons.map((btn) => {
          const { width, height, top, left, target } = btn;
          return {
            width: roundNumber(width),
            height: roundNumber(height),
            x: roundNumber(left),
            y: roundNumber(top),
            target: renameFileRef(target),
          };
        }),
      },
    };
  } else {
    new_data[new_key] = {
      img_filename: new_key,
      preset: "preset1",
      model: "washer-and-dryer",
      buttons: vkrs_data[key].buttons.map((btn) => {
        const { width, height, top, left, target } = btn;
        return {
          width: roundNumber(width),
          height: roundNumber(height),
          x: roundNumber(left) - 125,
          y: roundNumber(top) - 17,
          target: renameFileRef(target),
        };
      }),
      back_button: { target: "" },
    };
  }
}
//
writeFileSync("./screens.json", JSON.stringify(new_data));
