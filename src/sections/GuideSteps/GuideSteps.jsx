/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./steps.module.scss";
import { setCurrentStep, setSurveyOpen } from "../../store/slices/navigation";
import { ReactComponent as SatisfiedIcon } from "../../assets/images/icons/feedback-satisfied.svg";
import { ReactComponent as DissatisfiedIcon } from "../../assets/images/icons/feedback-dissatisfied.svg";
import { ReactComponent as ArrowChevron } from "../../assets/images/icons/steps-chevron.svg";
import { ReactComponent as MobileRetry } from "../../assets/images/icons/mobile-retry.svg";
import { useMediaQuery } from "@react-hook/media-query";
import { useClickOutside } from "@mantine/hooks";

export default function GuideSteps({ orientation }) {
  // const [surveyOpen, setSurveyOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [sessionId, setSessionId] = useState(() => generateUUID());
  const currStep = useSelector((state) => state.navigation.currentStep);
  const route = useSelector((state) => state.navigation);
  const currModel = useSelector((state) => state.navigation.model);
  const currVersion = useSelector((state) => state.navigation.version);
  const currTopic = useSelector((state) => state.navigation.topic);
  const topic =
    useSelector(
      (state) =>
        state.data?.doc?.guide?.[currModel]?.[currVersion]?.topic?.[currTopic]
    ) || {};
  const steps = topic?.steps || [];
  function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  const progress = Math.round(((currStep + 1) / steps.length) * 100);

  useEffect(() => {
    if (sessionId && progress < Infinity && progress > 0) {
      window?._paq.push([
        "trackEvent",
        "Progress",
        `{"id":"${sessionId}","progress":${progress},"timestamp":${Date.now()},"model":"${currModel}","version":"${currVersion}","topic":"${currTopic}"}`,
      ]);
    }
  }, [progress]);

  const mobile = useMediaQuery(
    orientation === "landscape" ? "(max-width: 1240px)" : "(max-width: 960px)"
  );
  const landscape = useMediaQuery(
    orientation === "landscape"
      ? "(max-height: 550px) and (max-width: 1240px)"
      : "(max-width: 960px)"
  );
  const mode = useSelector((state) => state.navigation.mode);
  const helpOpen = useSelector((state) => state.help.active);
  const helpStep = useSelector((state) => state.help.current);
  const uitext = useSelector((state) => state.data.uitext);
  const surveyOpen = useSelector((state) => state.navigation.surveyOpen);
  const dispatch = useDispatch();

  const isLastStep = currStep === steps.length - 1;

  const currStepText = (
    <div
      className={`${styles["steps__curr-step"]}${
        landscape ? " landscape" : ""
      }`}
    >
      <p>
        <span className={styles["curr-num"]}>
          {currStep < 9 && "0"}
          {currStep + 1}
        </span>
        <span className={styles["steps-length"]}>
          /{steps.length <= 9 && "0"}
          {steps.length}
        </span>
      </p>
    </div>
  );

  useEffect(() => {
    // Check if --survey-mobile-height is undefined or not set, and if so, set it to 100px
    // Use #root instead of document.documentElement to prevent CSS leakage to parent page
    const rootElement = document.getElementById("root");
    if (rootElement) {
      const currentCssHeight = getComputedStyle(rootElement).getPropertyValue(
        "--survey-mobile-height"
      );
      if (!currentCssHeight || currentCssHeight.trim() === "") {
        rootElement.style.setProperty("--survey-mobile-height", "80px");
      }
    }
    dispatch(setSurveyOpen(true));
  }, [steps, currStep, mobile]);

  useEffect(() => {
    setSubmitted(false);
  }, [topic]);

  // Log height of survey-mobile element and update CSS custom property with smooth transition
  useEffect(() => {
    const animateHeightChange = () => {
      const surveyElement = document.getElementById("survey-mobile");
      const rootElement = document.getElementById("root");

      if (rootElement) {
        // In landscape mode, check if survey should be shown
        if (landscape) {
          const showSurveyInstead = isLastStep && !submitted;

          // If survey is not shown in landscape, set height to 0
          if (!showSurveyInstead) {
            rootElement.style.setProperty("--survey-mobile-height", "0px");
            return;
          }
        }

        // Survey is visible (mobile or landscape with survey shown)
        if (surveyElement) {
          const currentHeight = surveyElement.offsetHeight;
          console.log("Survey mobile height:", currentHeight);

          // Get current CSS custom property value from root element (not document.documentElement)
          const currentCssHeight = getComputedStyle(
            rootElement
          ).getPropertyValue("--survey-mobile-height");
          const currentCssHeightValue = parseInt(currentCssHeight) || 0;

          // Only animate if height actually changed
          if (Math.abs(currentHeight - currentCssHeightValue) > 5) {
            // Animate the height change
            const startHeight = currentCssHeightValue;
            const targetHeight = currentHeight;
            const duration = 400; // 0.4s
            const startTime = performance.now();

            const animate = (currentTime) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);

              // Easing function (ease-in-out)
              const easeInOut =
                progress < 0.5
                  ? 2 * progress * progress
                  : 1 - Math.pow(-2 * progress + 2, 3) / 2;

              const currentHeight =
                startHeight + (targetHeight - startHeight) * easeInOut;

              // Set CSS variable on root element instead of document.documentElement
              rootElement.style.setProperty(
                "--survey-mobile-height",
                `${currentHeight}px`
              );

              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };

            requestAnimationFrame(animate);
          } else {
            // No significant change, just update directly
            rootElement.style.setProperty(
              "--survey-mobile-height",
              `${currentHeight}px`
            );
          }
        } else if (mobile) {
          // Mobile mode but survey element not found, keep default
          const currentCssHeight = getComputedStyle(
            rootElement
          ).getPropertyValue("--survey-mobile-height");
          if (!currentCssHeight || currentCssHeight.trim() === "") {
            rootElement.style.setProperty("--survey-mobile-height", "80px");
          }
        }
      }
    };

    // Animate height when survey state changes
    // Use longer timeout when feedback is set (comment input appears) to allow DOM to settle
    const timeout = feedback ? 200 : 100;
    const timeoutId = setTimeout(animateHeightChange, timeout);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    feedback,
    submitted,
    surveyOpen,
    landscape,
    currStep,
    steps.length,
    mobile,
  ]);

  if (landscape) {
    const showSurveyInstead = isLastStep && !submitted;

    return (
      <>
        {orientation === "portrait" ? (
          <div className={styles["steps__header"]} style={{ width: "100%" }}>
            <h2>{topic.title}</h2>
          </div>
        ) : null}
        {showSurveyInstead ? (
          <div
            className={styles["steps__container"]}
            data-mobile={mobile}
            data-landscape-survey={true}
            style={{ height: "auto", minHeight: "100%", overflow: "visible" }}
          >
            <SimulatorSurvey
              feedback={feedback}
              setFeedback={setFeedback}
              surveyOpen={surveyOpen}
              setSurveyOpen={setSurveyOpen}
              mobile={mobile}
              landscape={landscape}
              model={currModel}
              route={route}
              uitext={uitext}
              submitted={submitted}
              setSubmitted={setSubmitted}
              topic={topic}
              isLastStep={isLastStep}
            />
          </div>
        ) : (
          <div className={styles["steps__container"]} data-mobile={mobile}>
            <SimulatorProgressBar current={currStep} total={steps.length} />
            <section
              className={styles["steps__content"]}
              style={{ flex: 2, flexDirection: "column", height: "100%" }}
            >
              <div
                className={styles["steps__instruction"]}
                tabIndex={0}
                role="region"
                aria-label="Step instructions"
                onWheel={(e) => e.stopPropagation()}
                onTouchStart={(e) => {
                  e.stopPropagation();
                }}
                onTouchMove={(e) => {
                  e.stopPropagation();
                }}
                onKeyDown={(e) => {
                  const scrollAmount = 50; // pixels to scroll per key press
                  switch (e.key) {
                    case 'ArrowDown':
                      e.preventDefault();
                      e.currentTarget.scrollTop += scrollAmount;
                      break;
                    case 'ArrowUp':
                      e.preventDefault();
                      e.currentTarget.scrollTop -= scrollAmount;
                      break;
                    case 'PageDown':
                      e.preventDefault();
                      e.currentTarget.scrollTop += e.currentTarget.clientHeight;
                      break;
                    case 'PageUp':
                      e.preventDefault();
                      e.currentTarget.scrollTop -= e.currentTarget.clientHeight;
                      break;
                    case 'Home':
                      e.preventDefault();
                      e.currentTarget.scrollTop = 0;
                      break;
                    case 'End':
                      e.preventDefault();
                      e.currentTarget.scrollTop = e.currentTarget.scrollHeight;
                      break;
                  }
                }}
              >
                {orientation === "portrait" ? null : currStepText}
                <section className={styles["steps__text-container"]}>
                  {topic.topic_note && currStep === 0 ? (
                    <div
                      className={styles["steps__text"]}
                      style={{ marginBottom: "8px" }}
                      dangerouslySetInnerHTML={{
                        __html: topic.topic_note,
                      }}
                    />
                  ) : null}
                  <div
                    className="steps__text"
                    dangerouslySetInnerHTML={{
                      __html: steps[currStep]?.text,
                    }}
                  />
                  {steps[currStep]?.note && (
                    <div
                      className="steps__note__text"
                      dangerouslySetInnerHTML={{
                        __html: steps[currStep]?.note,
                      }}
                    />
                  )}
                </section>
              </div>
            </section>
            <SimulatorBtns
              currStep={currStep}
              steps={steps}
              landscape={landscape}
              currStepText={currStepText}
              setFeedback={setFeedback}
              surveyOpen={surveyOpen}
              setSurveyOpen={setSurveyOpen}
              uitext={uitext}
            />
          </div>
        )}
      </>
    );
  } else {
    return (
      <>
        <div
          className={`${styles["steps__container"]}${
            surveyOpen ? " " + styles["survey-open"] : ""
          }`}
          style={{ borderRight: !mobile ? "1px solid #c6c7c9" : "inherit" }}
          data-mobile={mobile}
        >
          <div className={styles["steps__header"]}>
            <h2>{topic.title}</h2>
          </div>
          <section className={styles["steps__content"]}>
            <div 
              className={styles["steps__instruction"]}
              tabIndex={0}
              role="region"
              aria-label="Step instructions"
              onKeyDown={(e) => {
                const scrollAmount = 50; // pixels to scroll per key press
                switch (e.key) {
                  case 'ArrowDown':
                    e.preventDefault();
                    e.currentTarget.scrollTop += scrollAmount;
                    break;
                  case 'ArrowUp':
                    e.preventDefault();
                    e.currentTarget.scrollTop -= scrollAmount;
                    break;
                  case 'PageDown':
                    e.preventDefault();
                    e.currentTarget.scrollTop += e.currentTarget.clientHeight;
                    break;
                  case 'PageUp':
                    e.preventDefault();
                    e.currentTarget.scrollTop -= e.currentTarget.clientHeight;
                    break;
                  case 'Home':
                    e.preventDefault();
                    e.currentTarget.scrollTop = 0;
                    break;
                  case 'End':
                    e.preventDefault();
                    e.currentTarget.scrollTop = e.currentTarget.scrollHeight;
                    break;
                }
              }}
            >
              {topic.topic_note && currStep === 0 ? (
                <div
                  className={styles["steps__topic_note"]}
                  dangerouslySetInnerHTML={{
                    __html: topic.topic_note,
                  }}
                />
              ) : null}
              <div
                className={styles["steps__step-content"]}
                style={{ display: "flex" }}
              >
                <p className={styles["steps__curr-step-num"]}>
                  {[currStep + 1]}.
                </p>
                <section className={styles["steps__text-container"]}>
                  <div
                    className={styles["steps__text"]}
                    dangerouslySetInnerHTML={{
                      __html: steps[currStep]?.text,
                    }}
                  />
                  {steps[currStep]?.note && (
                    <div className={styles["steps__note"]}>
                      <div
                        className={styles["steps__note__text"]}
                        dangerouslySetInnerHTML={{
                          __html: steps[currStep].note,
                        }}
                      />
                    </div>
                  )}
                </section>
              </div>
            </div>
            {!mobile && (
              <SimulatorSurvey
                mobile={mobile}
                surveyOpen={surveyOpen}
                setSurveyOpen={setSurveyOpen}
                feedback={feedback}
                setFeedback={setFeedback}
                model={currModel}
                route={route}
                uitext={uitext}
                submitted={submitted}
                setSubmitted={setSubmitted}
                topic={topic}
                isLastStep={isLastStep}
              />
            )}
          </section>
          <SimulatorBtns
            currStep={currStep}
            steps={steps}
            currStepText={currStepText}
            surveyOpen={surveyOpen}
            setFeedback={setFeedback}
            uitext={uitext}
          />
        </div>
        {mobile && (
          <SimulatorSurvey
            mobile={mobile}
            surveyOpen={surveyOpen}
            setSurveyOpen={setSurveyOpen}
            feedback={feedback}
            setFeedback={setFeedback}
            model={currModel}
            route={route}
            uitext={uitext}
            submitted={submitted}
            setSubmitted={setSubmitted}
            topic={topic}
            isLastStep={isLastStep}
          />
        )}
      </>
    );
  }
}

function SimulatorBtns({
  steps,
  landscape,
  currStepText,
  surveyOpen,
  currStep,
  uitext,
}) {
  const dispatch = useDispatch();
  const currModel = useSelector((state) => state.navigation.model);
  const currTopic = useSelector((state) => state.navigation.topic);
  const [surveyOpened, setSurveyOpened] = useState(false);
  const updateCurrStepInc = () => dispatch(setCurrentStep(currStep + 1));
  const updateCurrStepDec = () => dispatch(setCurrentStep(currStep - 1));
  const updateCurrStepReset = () => {
    if (surveyOpened) {
      dispatch(setCurrentStep(0));
    }
  };

  useEffect(() => {
    if (surveyOpen) {
      setSurveyOpened(true);
    }
    if (currStep === 0) {
      setSurveyOpened(false);
    }
  }, [surveyOpen, currStep]);
  if (landscape) {
    return (
      <div className={styles["steps__chev-btns"]}>
        <button
          onClick={updateCurrStepDec}
          disabled={currStep === 0}
          data-link_cat={"simulators"}
          data-link_id={"previous"}
          data-link_position={`${currTopic}>${currModel}`}
          data-event_name={"select_previous_click"}
        >
          <span className="sr-only">{uitext?.text_prev || "Prev"}</span>
          <ArrowChevron />
        </button>
        {currStep === steps.length - 1 ? (
          <button
            className={styles["retry-btn"]}
            onClick={updateCurrStepReset}
            data-link_cat={"simulators"}
            data-link_id={"restart"}
            data-link_position={`${currTopic}>${currModel}`}
            data-event_name={"select_restart_click"}
          >
            <span className="sr-only">{uitext?.text_restart || "Restart"}</span>
            <MobileRetry />
          </button>
        ) : (
          <button
            onClick={updateCurrStepInc}
            disabled={steps.length - 1 === currStep}
            data-link_cat={"simulators"}
            data-link_id={"next"}
            data-link_position={`${currTopic}>${currModel}`}
            data-event_name={"select_next_click"}
          >
            <span className="sr-only">{uitext?.text_next || "Next"}</span>
            <ArrowChevron />
          </button>
        )}
      </div>
    );
  } else {
    return (
      <div className={styles["steps__btns"]}>
        <button
          onClick={updateCurrStepDec}
          disabled={currStep === 0}
          data-link_cat={"simulators"}
          data-link_id={"previous"}
          data-link_position={`${currTopic}>${currModel}`}
          data-event_name={"select_previous_click"}
        >
          {uitext?.text_prev || "Prev"}
        </button>
        {currStepText}
        {/* Retry button */}
        {currStep === steps.length - 1 ? (
          <button
            className={styles["retry-btn"]}
            onClick={updateCurrStepReset}
            data-link_cat={"simulators"}
            data-link_id={"restart"}
            data-link_position={`${currTopic}>${currModel}`}
            data-event_name={"select_restart_click"}
          >
            {/* <Icon name="retry" /> */}
            {uitext?.text_restart || "Restart"}
          </button>
        ) : (
          <button
            onClick={updateCurrStepInc}
            data-link_cat={"simulators"}
            data-link_id={"next"}
            data-link_position={`${currTopic}>${currModel}`}
            data-event_name={"select_next_click"}
          >
            {uitext?.text_next || "Next"}
          </button>
        )}
      </div>
    );
  }
}

function SimulatorProgressBar({ current, total }) {
  return (
    <div className={styles["steps__progress-bar"]}>
      <div
        className={styles["steps__progress-bar__current"]}
        style={{
          width: `calc((100% / ${total}) * (${current} + 1))`,
        }}
      />
    </div>
  );
}

function SimulatorSurvey({
  mobile,
  landscape,
  surveyOpen,
  setSurveyOpen,
  feedback,
  setFeedback,
  uitext,
  submitted,
  setSubmitted,
  topic,
  isLastStep,
}) {
  //const ref = useClickOutside(() => surveyOpen && dispatch(setSurveyOpen(false)));
  const [comment, setComment] = useState("");
  const [submittable, setSubmittable] = useState(false);
  const route = useSelector((state) => state.navigation);
  const dispatch = useDispatch();

  useEffect(() => {
    setSubmittable(feedback || comment.length > 0);
  }, [feedback, comment]);

  function resetSurvey() {
    setComment("");
    setFeedback(null);
  }

  useEffect(() => {
    resetSurvey();
  }, [topic]);

  const submitScreen = (
    <div className={styles["steps__survey__submitted"]}>
      <div className={styles["steps__survey__submitted--icon"]}>
        <SatisfiedIcon />
      </div>
      <div className={styles["steps__survey__submitted--text"]}>
        <p>Thank you for your feedback!</p>
      </div>
    </div>
  );

  const surveyContent = (
    <div className={styles["steps__survey__content"]}>
      {submitted ? (
        submitScreen
      ) : (
        <>
          <section>
            {mobile ? (
              <p
                className={styles["steps__survey__feedback-header"]}
                onClick={() => dispatch(setSurveyOpen(!surveyOpen))}
              >
                {uitext?.text_survey_title || "Was this content helpful?"}
              </p>
            ) : null}

            <p style={{ margin: "10px 0 15px 0" }}>
              {uitext?.text_survey_question ||
                "Did you find what you were looking for?"}
            </p>
            <div className={styles["steps__survey__btn"]}>
              <button
                className={`${styles["steps__survey__btn--agree"]}${
                  feedback === "agree" ? " " + styles["active"] : ""
                }`}
                onClick={() => setFeedback("agree")}
              >
                <SatisfiedIcon />
                <span className="sr-only">Yes</span>
              </button>
              <button
                className={`${styles["steps__survey__btn--disagree"]}${
                  feedback === "disagree" ? " " + styles["active"] : ""
                }`}
                onClick={() => setFeedback("disagree")}
              >
                <DissatisfiedIcon />
                <span className="sr-only">No</span>
              </button>
            </div>
          </section>

          <section>
            <span
              className={styles["steps__survey__input-header"]}
              style={{ textAlign: "center" }}
            >
              {uitext?.text_user_message_question || "How can we improve?"}
            </span>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (feedback || comment) {
                  window._paq.push([
                    "trackEvent",
                    `${route.model}-Survey-${route.topic}`,
                    `${feedback ? "Helpful?: " + feedback + " " : ""}${
                      comment ? `Comment: ${comment}` : ""
                    }`,
                  ]);
                  setSubmitted(true);
                  resetSurvey();
                  setTimeout(() => dispatch(setSurveyOpen(false)), 2000);
                }
              }}
            >
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <input
                type="submit"
                value={uitext?.text_submit || "Submit"}
                disabled={!comment.length > 0}
              />
            </form>
          </section>
        </>
      )}
    </div>
  );

  // Show mobile survey version for both mobile and landscape modes
  if (mobile || landscape) {
    return (
      <div
        className={styles[`steps__survey--mobile__active`]}
        id="survey-mobile"
        data-landscape={landscape}
        data-has-feedback={!!feedback}
      >
        <div
          className={styles["steps__survey--mobile__wrapper"]}
          data-landscape={landscape}
        >
          {submitted ? (
            <div
              className={styles["steps__new__survey__thankyou"]}
              style={{ justifyContent: "center" }}
            >
              <p>Thank you for your feedback!</p>
            </div>
          ) : !feedback ? (
            <div className={styles["steps__new__survey__content"]} data-last-step={isLastStep}>
              <div className={styles["steps__new__survey__header"]}>
                <h2>
                {uitext?.text_survey_title || "Was this content helpful?"}
                </h2>
              </div>
              <div className={styles["steps__new__survey__buttons"]}>
                <button
                  className={styles["steps__new__survey__buttons__yes"]}
                  onClick={() => {
                    // Immediately submit "agree" survey when Yes is clicked
                    window._paq.push([
                      "trackEvent",
                      `${route.model}-Survey-${route.topic}`,
                      "Helpful?: agree",
                    ]);
                    setFeedback("agree");
                  }}
                >
                  Yes
                </button>
                <button
                  className={styles["steps__new__survey__buttons__no"]}
                  onClick={() => {
                    setFeedback("disagree");
                  }}
                >
                  No
                </button>
              </div>
            </div>
          ) : (
            <section
              className={styles[`steps__new__survey__input`]}
              style={{ padding: "24px 14px 12px 24px", gap: "8px" }}
            >
              <span
                className={styles["steps__new__survey__input-header"]}
                style={{ textAlign: "center" }}
              >
                {feedback === "agree"
                  ? uitext?.text_user_message_question_positive ||
                    "Tell us more about your experience."
                  : uitext?.text_user_message_question || "How can we improve?"}
              </span>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (feedback || comment) {
                    // If feedback is "agree", send another "agree" survey with comment
                    // If feedback is "disagree", send "disagree" survey with comment
                    const surveyData = feedback === "agree" 
                      ? `Helpful?: agree ${comment ? `Comment: ${comment}` : ""}`
                      : `Helpful?: ${feedback} ${comment ? `Comment: ${comment}` : ""}`;
                    
                    window._paq.push([
                      "trackEvent",
                      `${route.model}-Survey-${route.topic}`,
                      surveyData,
                    ]);
                    setSubmitted(true);
                    resetSurvey();
                  }
                }}
                style={{ gap: "8px" }}
              >
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <input
                  type="submit"
                  value={uitext?.text_submit || "Submit"}
                  disabled={feedback === "disagree" && !comment.length > 0}
                />
              </form>
            </section>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles["steps__new__survey"]}>
        {submitted ? (
          <div className={styles["steps__new__survey__thankyou"]}>
            <p>Thank you for your feedback!</p>
          </div>
        ) : !feedback ? (
          <div 
            className={styles["steps__new__survey__content"]}
            data-last-step={isLastStep}
          >
            <div className={styles["steps__new__survey__header"]}>
              <h2>
                {uitext?.text_survey_title || "Was this content helpful?"}
              </h2>
            </div>
            <div className={styles["steps__new__survey__buttons"]}>
              <button
                className={styles["steps__new__survey__buttons__yes"]}
                onClick={() => {
                  // Immediately submit "agree" survey when Yes is clicked
                  window._paq.push([
                    "trackEvent",
                    `${route.model}-Survey-${route.topic}`,
                    "Helpful?: agree",
                  ]);
                  setFeedback("agree");
                }}
              >
                Yes
              </button>
              <button
                className={styles["steps__new__survey__buttons__no"]}
                onClick={() => {
                  setFeedback("disagree");
                }}
              >
                No
              </button>
            </div>
          </div>
        ) : (
          <section className={styles["steps__new__survey__input"]}>
            <span className={styles["steps__new__survey__input-header"]}>
              {feedback === "agree"
                ? uitext?.text_user_message_question_positive ||
                  "Tell us more about your experience."
                : uitext?.text_user_message_question || "How can we improve?"}
            </span>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (feedback || comment) {
                  // If feedback is "agree", send another "agree" survey with comment
                  // If feedback is "disagree", send "disagree" survey with comment
                  const surveyData = feedback === "agree" 
                    ? `Helpful?: agree ${comment ? `Comment: ${comment}` : ""}`
                    : `Helpful?: ${feedback} ${comment ? `Comment: ${comment}` : ""}`;
                  
                  window._paq.push([
                    "trackEvent",
                    `${route.model}-Survey-${route.topic}`,
                    surveyData,
                  ]);
                  setSubmitted(true);
                  resetSurvey();
                }
              }}
            >
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <input
                type="submit"
                value={uitext?.text_submit || "Submit"}
                disabled={feedback === "disagree" && !comment.length > 0}
              />
            </form>
          </section>
        )}
      </div>
    );
  }
}
