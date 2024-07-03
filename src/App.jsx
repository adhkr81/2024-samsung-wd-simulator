import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAssetsPath, setIntialData, updateTopics } from "./store/slices/data";
import LoaderWithOverlay from "./components/LoaderWithOverlay/LoaderWithOverlay";
import styles from "./styles/Samsung.module.scss";
import Footer from "./layouts/HorizontalLayout/sections/Footer/Footer";
import {
  setAgentStatus,
  setInitialRoute,
  setMode,
  setModel,
  setSubPage,
  setTopic,
  setVersion,
} from "./store/slices/navigation";

const HorizontalLayout = lazy(() =>
  import("./layouts/HorizontalLayout/HorizontalLayout")
);

export default function App() {
  const route = useSelector((state) => state.navigation);
  const model = route.model;
  const version = route.version;
  const dispatch = useDispatch();

  const setQueryParams = () => {};

  const fetchTopics = async (path, models) => {
    for (let m of models) {
      await fetch(`${path}/data/simulator/${m.id}/${m.latest}/topics.json`)
        .then((r) => r.json())
        .then((topics) => {
          dispatch(updateTopics({ topics: topics, model: m.id, version: m.latest }));
        });
    }
  };

  const setRoute = (params) => {
    const { topic, mode, model, version } = params;
    if (mode !== "overview" && topic) dispatch(setTopic(topic));
    if (mode) dispatch(setMode(mode));
    if (model) dispatch(setModel(model));
    if (version) dispatch(setVersion(version));
    if (mode === "overview") dispatch(setSubPage(topic));
  };

  const handlePopState = () => {
    const params = new URLSearchParams(window.location.search).get("topic");
    const possibleParams = ["mode", "model", "version"];
    let p_topic, p_mode, p_model, p_version;
    params.split("_").forEach((param, param_index) => {
      possibleParams.forEach((p) => {
        if (param_index === 0) p_topic = param;
        if (param.startsWith(p + "=")) {
          if (p === "mode") p_mode = param.replace(`${p}=`, "");
          if (p === "model") p_model = param.replace(`${p}=`, "");
          if (p === "version") p_version = param.replace(`${p}=`, "");
        }
      });
    });
    const { mode, topic, model, version } = route;
    if (
      p_mode !== mode ||
      p_topic !== topic ||
      p_model !== model ||
      p_version !== version
    ) {
      setRoute({ topic: p_topic, mode: p_mode, model: p_model, version: p_version });
      window._paq.push(["setCustomUrl", "?" + params.toString()]);
      window._paq.push(["setDocumentTitle", `${model}-${mode}-${topic}`]);
      window._paq.push(["trackPageView"]);
      const messages = {
        overview: {
          samsung_simulator: {
            mode: "overview",
            topic: topic,
            // model: model?.label,
          },
        },
        guide: {
          samsung_simulator: {
            mode: "guide",
            topic: topic,
            // model: model?.label,
          },
        },
        emulator: {
          samsung_simulator: {
            mode: "emulator",
            topic: topic,
            // model: model?.label,
          },
        },
        troubleshooting: {
          samsung_simulator: {
            mode: "troubleshooting",
            topic: topic,
            // model: model?.label,
          },
        },
      };
      const sendMessage = (message) => {
        window.parent.postMessage(messages[message], "*");
      };
      sendMessage(mode);
    }
  };

  useEffect(() => {
    if (!window._paq) {
      window._paq = window._paq || [];
    }

    const path = document.getElementById("root").getAttribute("data-path");
    const params = new URLSearchParams(window.location.search).get("topic");
    const agent = new URLSearchParams(window.location.search).get("agent");
    if (agent === "true") {
      dispatch(setAgentStatus(true));
    }
    dispatch(setAssetsPath(path));
    fetch(`${path}/data/data.json`)
      .then((r) => r.json())
      .then(async (data) => {
        // if (data?.settings?.siteId) {
        const scode = document.getElementById("root").getAttribute("data-sitecode");
        window._paq.push([
          "setTrackerUrl",
          "https://analytics.vicariouscontent.com/matomo.php",
        ]);
        window._paq.push(["setSiteId", 150]);
        window._paq.push(["setCustomDimension", 1, scode]);
        window._paq.push(["trackPageView"]);
        var d = document,
          g = d.createElement("script"),
          s = d.getElementsByTagName("script")[0];
        g.async = true;
        g.src = "https://analytics.vicariouscontent.com/matomo.js";
        s.parentNode.insertBefore(g, s);
        // }
        dispatch(setIntialData(data));
        if (!params) {
          const initial = data?.settings?.initial;
          dispatch(
            setInitialRoute({
              mode: initial.mode,
              model: initial.model,
              topic: initial.topic,
              version: initial.version,
              subpage: initial.subpage,
            })
          );
        }
        const models = data?.models
          ? Object.keys(data.models)
              .map((model) => ({
                id: model,
                order: data.models[model].order,
                latest: data.models[model].versions[0],
              }))
              .sort((a, b) => b.order - a.order)
          : [];
        await fetchTopics(path, models);
      });
    // example: ?topic=setup-your-tablet-for-the-first-time_mode=guide_model=tabs9ultra_version=v1

    if (params) {
      let topic, mode, model, version;
      const possibleParams = ["mode", "model", "version"];
      params.split("_").forEach((param, param_index) => {
        possibleParams.forEach((p) => {
          if (param_index === 0) topic = param;
          if (param.startsWith(p + "=")) {
            if (p === "mode") mode = param.replace(`${p}=`, "");
            if (p === "model") model = param.replace(`${p}=`, "");
            if (p === "version") version = param.replace(`${p}=`, "");
          }
        });
      });
      setRoute({ topic, mode, model, version });
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search).get("topic");
    if (params) {
      const possibleParams = ["mode", "model", "version"];
      let p_topic, p_mode, p_model, p_version;
      params.split("_").forEach((param, param_index) => {
        possibleParams.forEach((p) => {
          if (param_index === 0) p_topic = param;
          if (param.startsWith(p + "=")) {
            if (p === "mode") p_mode = param.replace(`${p}=`, "");
            if (p === "model") p_model = param.replace(`${p}=`, "");
            if (p === "version") p_version = param.replace(`${p}=`, "");
          }
        });
      });
      const { mode, topic, model, version, subpage } = route;
      if (mode === "overview") {
        p_topic = subpage;
      }
      if (
        mode &&
        (p_mode !== mode ||
          p_topic !== topic ||
          p_model !== model ||
          p_version !== version)
      ) {
        const newURL =
          window.location.protocol +
          "//" +
          window.location.host +
          window.location.pathname +
          "?" +
          "topic=" +
          `${mode === "overview" ? subpage : topic}` +
          "_mode=" +
          mode +
          "_model=" +
          model +
          "_version=" +
          version;
        window.history.pushState({ path: newURL }, "", newURL);
        window._paq.push(["setCustomUrl", "?" + params.toString()]);
        window._paq.push(["setDocumentTitle", `${model}-${mode}-${topic}`]);
        // window._paq.push(["trackPageView"]);
        const messages = {
          overview: {
            samsung_simulator: {
              mode: "overview",
              topic: topic,
              // model: model?.label,
            },
          },
          guide: {
            samsung_simulator: {
              mode: "guide",
              topic: topic,
              // model: model?.label,
            },
          },
          emulator: {
            samsung_simulator: {
              mode: "emulator",
              topic: topic,
              // model: model?.label,
            },
          },
          troubleshooting: {
            samsung_simulator: {
              mode: "troubleshooting",
              topic: topic,
              // model: model?.label,
            },
          },
        };
        const sendMessage = (message) => {
          window.parent.postMessage(messages[message], "*");
        };
        sendMessage(mode);
      }
    } else if (!params && route?.mode) {
      const { mode, topic, model, version, subpage } = route;
      const newURL =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        "?" +
        "topic=" +
        `${mode === "overview" ? subpage : topic}` +
        "_mode=" +
        mode +
        "_model=" +
        model +
        "_version=" +
        version;
      window.history.pushState({ path: newURL }, "", newURL);
      window._paq.push([
        "setCustomUrl",
        "?" +
          "topic=" +
          `${mode === "overview" ? subpage : topic}` +
          "_mode=" +
          mode +
          "_model=" +
          model +
          "_version=" +
          version,
      ]);
      window._paq.push(["setDocumentTitle", `${model}-${mode}-${topic}`]);
      window._paq.push(["trackPageView"]);
      const messages = {
        overview: {
          samsung_simulator: {
            mode: "overview",
            topic: subpage,
            // model: model?.label,
          },
        },
        guide: {
          samsung_simulator: {
            mode: "guide",
            topic: topic,
            // model: model?.label,
          },
        },
        emulator: {
          samsung_simulator: {
            mode: "emulator",
            topic: topic,
            // model: model?.label,
          },
        },
        troubleshooting: {
          samsung_simulator: {
            mode: "troubleshooting",
            topic: topic,
            // model: model?.label,
          },
        },
      };
      const sendMessage = (message) => {
        window.parent.postMessage(messages[message], "*");
      };
      sendMessage(mode);
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [route]);

  const fetchTopicsVersion = async (version) => {
    const path = document.getElementById("root").getAttribute("data-path");
    await fetch(`${path}/data/simulator/${route.model}/${version}/topics.json`)
      .then((r) => r.json())
      .then((topics) => {
        dispatch(
          updateTopics({ topics: topics, model: route.model, version: route.version })
        );
      });
  };

  useEffect(() => {
    if (model && version) {
      fetchTopicsVersion(version);
    }
  }, [version, model]);

  return (
    <>
      <div className={styles["simulator"]} data-layout={"landscape"}>
        <Suspense fallback={<LoaderWithOverlay />}>
          <HorizontalLayout styles={styles} setQueryParams={setQueryParams} />
        </Suspense>
      </div>
      <Footer styles={styles} mobile />
    </>
  );
}
