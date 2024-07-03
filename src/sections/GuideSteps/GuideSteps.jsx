/* eslint-disable react/prop-types */
import {
  text_next,
  text_prev,
  text_restart,
  text_survey_title,
  text_survey_question,
  text_user_message_question,
  text_submit,
} from "../../uitext/en";
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
  const [feedback, setFeedback] = useState("agree");
  const [submitted, setSubmitted] = useState(false);
  const currStep = useSelector((state) => state.navigation.currentStep);
  const route = useSelector((state) => state.navigation);
  const currModel = useSelector((state) => state.navigation.model);
  const currVersion = useSelector((state) => state.navigation.version);
  const currTopic = useSelector((state) => state.navigation.topic);
  const topic = useSelector((state) => state.data?.doc?.guide?.[currModel]?.[currVersion]?.topic?.[currTopic]) || {};
  const steps = topic?.steps || [];
  const mobile = useMediaQuery(orientation === "landscape" ? "(max-width: 1240px)" : "(max-width: 960px)");
  const landscape = useMediaQuery(
    orientation === "landscape" ? "(max-height: 550px) and (max-width: 1240px)" : "(max-width: 960px)"
  );
  const mode = useSelector((state) => state.navigation.mode);
  const helpOpen = useSelector((state) => state.help.active);
  const helpStep = useSelector((state) => state.help.current);
  const surveyOpen = useSelector((state) => state.navigation.surveyOpen);
  const dispatch = useDispatch();

  const currStepText = (
    <div className={`${styles["steps__curr-step"]}${landscape ? " landscape" : ""}`}>
      <p className={`${surveyOpen ? styles["disabled-curr-num"] : ""}`}>
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
    let timeoutId;
  
    if (currStep === steps.length - 1 && !surveyOpen && !submitted) {
      timeoutId = setTimeout(() => {
        dispatch(setSurveyOpen(true));
      }, 1000);
    } 
  
    return () => {
      clearTimeout(timeoutId);
    };
  }, [steps, currStep]);

  useEffect(() => {
    setSubmitted(false)
  },[topic])


  if (landscape) {
    return (
      <>
        {orientation === "portrait" ? (
          <div className={styles["steps__header"]} style={{ width: "100%" }}>
            <h2>{topic.title}</h2>
          </div>
        ) : null}
        <div className={styles["steps__container"]} data-mobile={mobile}>
          <SimulatorProgressBar current={currStep} total={steps.length} />
          <section className={styles["steps__content"]} style={{ flex: 2, flexDirection: "column", height: "100%" }}>
            <div
              className={styles["steps__instruction"]}
              onWheel={(e) => e.stopPropagation()}
              onTouchStart={(e) => {
                e.stopPropagation();
              }}
              onTouchMove={(e) => {
                e.stopPropagation();
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
          />
        </div>
        <SimulatorSurvey
          feedback={feedback}
          setFeedback={setFeedback}
          surveyOpen={surveyOpen}
          setSurveyOpen={setSurveyOpen}
          mobile={mobile}
          model={currModel}
          route={route}
          submitted={submitted}
          setSubmitted={setSubmitted}
          topic={topic}
        />
      </>
    );
  } else {
    return (
      <>
        <div
          className={`${styles["steps__container"]}${surveyOpen ? " " + styles["survey-open"] : ""}`}
          data-mobile={mobile}
        >
          <div className={styles["steps__header"]}>
            <h2>{topic.title}</h2>
          </div>
          <section className={styles["steps__content"]}>
            <div className={styles["steps__instruction"]}>
              {topic.topic_note && currStep === 0 ? (
                <div
                  className={styles["steps__topic_note"]}
                  dangerouslySetInnerHTML={{
                    __html: topic.topic_note,
                  }}
                />
              ) : null}
              <div className={styles["steps__step-content"]} style={{ display: "flex" }}>
                <p className={styles["steps__curr-step-num"]}>{[currStep + 1]}.</p>
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
                submitted={submitted}
                setSubmitted={setSubmitted}
                topic={topic}
              />
            )}
          </section>
          <SimulatorBtns
            currStep={currStep}
            steps={steps}
            currStepText={currStepText}
            surveyOpen={surveyOpen}
            setFeedback={setFeedback}
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
            submitted={submitted}
            setSubmitted={setSubmitted}
            topic={topic}
          />
        )}
      </>
    );
  }
}

function SimulatorBtns({ steps, landscape, currStepText, surveyOpen, currStep }) {
  const dispatch = useDispatch();
  const updateCurrStepInc = () => dispatch(setCurrentStep(currStep + 1));
  const updateCurrStepDec = () => dispatch(setCurrentStep(currStep - 1));
  const updateCurrStepReset = () => dispatch(setCurrentStep(0));
  if (landscape) {
    return (
      <div className={styles["steps__chev-btns"]}>
        <button onClick={updateCurrStepDec} disabled={currStep === 0}>
          <span className="sr-only">{text_prev}</span>
          <ArrowChevron />
        </button>
        {currStep === steps.length - 1 ? (
          <button className={styles["retry-btn"]} onClick={updateCurrStepReset}>
            <span className="sr-only">{text_restart}</span>
            <MobileRetry />
          </button>
        ) : (
          <button onClick={updateCurrStepInc} disabled={steps.length - 1 === currStep || surveyOpen}>
            <span className="sr-only">{text_next}</span>
            <ArrowChevron />
          </button>
        )}
      </div>
    );
  } else {
    return (
      <div className={styles["steps__btns"]}>
        <button onClick={updateCurrStepDec} disabled={currStep === 0 || surveyOpen}>
          {text_prev}
        </button>
        {currStepText}
        {/* Retry button */}
        {currStep === steps.length - 1 ? (
          <button className={styles["retry-btn"]} onClick={updateCurrStepReset}>
            {/* <Icon name="retry" /> */}
            {text_restart}
          </button>
        ) : (
          <button onClick={updateCurrStepInc}>
            {text_next}
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

function SimulatorSurvey({ mobile, surveyOpen, setSurveyOpen, feedback, setFeedback, submitted, setSubmitted, topic }) {
  const ref = useClickOutside(() => surveyOpen && dispatch(setSurveyOpen(false)));
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
  resetSurvey()
},[topic])

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
              <p className={styles["steps__survey__feedback-header"]} onClick={() => dispatch(setSurveyOpen(!surveyOpen))}>
                {text_survey_title}
              </p>
            ) : null}

            <p style={{ margin: "10px 0 15px 0" }}>{text_survey_question}</p>
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
            <span className={styles["steps__survey__input-header"]}>{text_user_message_question}</span>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (feedback || comment) {
                  window._paq.push([
                    "trackEvent",
                    `${route.model}-Survey-${route.topic}`,
                    `${feedback ? "Helpful?: " + feedback + " " : ""}${comment ? `Comment: ${comment}` : ""}`,
                  ]);
                  setSubmitted(true);
                  resetSurvey();
                  setTimeout(() => dispatch(setSurveyOpen(false)), 2000);
                }
              }}
            >
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
              <input type="submit" value={text_submit} disabled={!submittable} />
            </form>
          </section>
        </>
      )}
    </div>
  );

  if (mobile) {
    return (
      <div className={styles[`steps__survey--mobile${surveyOpen ? "__active" : ""}`]} ref={ref}>
        {surveyOpen ? <div className={styles["steps__survey--mobile__wrapper"]}>{surveyContent}</div> : null}
      </div>
    );
  } else {
    return (
      <div
        className={`${styles["steps__survey"]}${
          surveyOpen === false ? " " + styles["closeSurvey"] : surveyOpen === true ? " " + styles["openSurvey"] : ""
        }`}
        ref={ref}
      >
        <div className={styles["steps__survey__header"]} onClick={() => dispatch(setSurveyOpen(!surveyOpen))}>
          <h2>{text_survey_title}</h2>
        </div>
        <div className={styles["steps__survey__header_overlay"]} />
        {surveyContent}
      </div>
    );
  }
}
