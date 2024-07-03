/* eslint-disable react/prop-types */
import { useState } from "react";
import { ReactComponent as SearchIcon } from "../../../assets/images/icons/search-icon.svg";
import { ReactComponent as Arrow } from "../../../assets/images/icons/arrow-icon.svg";
import {
  text_search,
  text_search_help_prompt_desktop,
  text_search_no_result_desktop,
} from "../../../uitext/en";
import { useDispatch, useSelector } from "react-redux";
import {
  setDrawerOpen,
  setMode,
  setTopic,
} from "../../../store/slices/navigation";
import { Popover } from "@mantine/core";
import OnBoardingModal from "../../HelpPopup/HelpPopup";

export default function TopicSearch({
  setSimMenuOpen,
  setQueryParams,
  inputActive,
  setInputActive,
  styles,
}) {
  const dispatch = useDispatch();
  const remove = [];
  const [result, setResult] = useState(null);

  const { model, version } = useSelector((state) => state.navigation);
  const helpOpen = useSelector((state) => state.help.active);
  const helpStep = useSelector((state) => state.help.current);

  const mode = useSelector((state) => state.navigation.mode);
  const list_topics =
    useSelector((state) => state.data?.doc?.[mode]?.[model]?.[version]?.map) ||
    {};

  const [searchValue, setSearchValue] = useState("");
  const full = Object.keys(list_topics)
    .map((key) => [...list_topics[key]])
    .flat(1);
  const topics =
    remove.length > 0
      ? full.filter((el) => {
          return remove.some((f) => {
            return f !== el.url;
          });
        })
      : full;
  const keys = Object.keys(list_topics);
  function handleSearch(value) {
    setSearchValue(value);
    if (value && value.length > 0) {
      const resultArr = [];
      for (let topic of topics) {
        if (
          !remove.includes(topic?.url) &&
          topic?.title?.toLowerCase()?.includes(value?.toLowerCase())
        ) {
          resultArr.push(topic);
        }
      }
      setResult(resultArr);
    } else {
      setResult([]);
    }
  }

  return (
    <>
      <Popover
        opened={helpOpen && (helpStep === 5 || helpStep === 6 || helpStep === 7) ? true : false}
        onChange={() => {}}
        position={"bottom-start"}
        offset={{ crossAxis: 40 }}
        withinPortal
        styles={{
          dropdown: {
            backgroundColor: "transparent",
            border: "none",
          },
        }}
      >
        <Popover.Target>
          <form
            className={`${styles["simulator-side-menu__search"]}${
              inputActive ? " " + styles["search-input-active"] : ""
            }`}
            onClick={() => (inputActive ? null : setInputActive(true))}
          >
            <button
              className={styles["simulator-side-menu__search--icon"]}
              onClick={(e) => {
                e.preventDefault();
                setInputActive(false);
              }}
            >
              {inputActive ? <Arrow /> : <SearchIcon />}
            </button>
            <input
              type="text"
              value={searchValue}
              placeholder={text_search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </form>
        </Popover.Target>
        <Popover.Dropdown>
          <OnBoardingModal />
        </Popover.Dropdown>
      </Popover>
      {inputActive ? (
        <div className={styles["simulator-side-menu__search-result"]}>
          {searchValue.length > 0 ? (
            searchValue.length > 1 && result.length > 0 ? (
              <ul
                className={styles["simulator-side-menu__search-result--list"]}
              >
                {result.map((link, index) => (
                  <li
                    role={"button"}
                    key={index}
                    className={
                      styles["simulator-side-menu__search-result--item"]
                    }
                    onClick={() => {
                      dispatch(setMode(mode));
                      dispatch(setTopic(link.url));
                      setSearchValue("");
                      setInputActive(false);
                      setResult(null);
                      dispatch(setDrawerOpen(false));
                      // setQueryParams([
                      //   ["mode", "guide"],
                      //   ["topic", link.url],
                      // ]);
                    }}
                  >
                    <strong>&gt;&nbsp; </strong> {link.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles["simulator-side-menu__search-no-result"]}>
                {text_search_no_result_desktop}
              </p>
            )
          ) : (
            <>
              <p className={styles["simulator-side-menu__search-title"]}>
                {text_search_help_prompt_desktop}
              </p>
              <div
                className={styles["simulator-side-menu__search-suggestions"]}
              >
                {keys.map((key, index) => (
                  <button
                    key={index}
                    className={
                      styles["simulator-side-menu__search--preview-item"]
                    }
                    onClick={() => {
                      setQueryParams(
                        ["mode", "guide"],
                        ["topic", list_topics[key][0].url]
                      );
                      dispatch(setDrawerOpen(false));
                      dispatch(setTopic(list_topics[key][0].url));
                      setTimeout(() => setInputActive(false), 250);
                    }}
                  >
                    {list_topics?.[key]?.[0]?.title}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ) : null}
    </>
  );
}
