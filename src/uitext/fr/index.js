const text_disclaimer =
  "Les écrans et les images sont simulés. Les fonctions peuvent varier selon le modèle et le pays.";
const text_menu = [
  {
    title: "Mode d'emploi",
    url: "Guide",
    children: false,
  },

  {
    title: "Emulator",
    url: "Emulator",
    children: false,
  },
  {
    title: "Aperçu",
    url: "Overview",
    children: [
      { title: "Téléviseur", url: "tv-home" },
      { title: "Slim One Connect", url: "slim-one-connect" },
      { title: "One Télécommande", url: "one-remote" },
    ],
  },
];
const text_next = "Suivant";
const text_prev = "Précédent";
const text_note = "Remarquer";
const text_end_help = "Guide de fin...";
const text_search = "Recherche";
const text_search_help_prompt_desktop = "Que cherchez-vous?";
const text_search_no_result_desktop = "Aucun résultat trouvé";
const text_search_help_prompt_mobile = "Tapez pour rechercher";
const text_search_no_result_mobile = "Aucun résultat trouvé";
const text_survey_title = "Était-ce utile?";
const text_survey_question = "As-tu trouvé ce que tu cherchais?";
const text_user_message_question = "Comment pouvons nous nous améliorer?";
const text_submit = "Soumettre";
const text_done = "Fait";
const text_restart = "Redémarrer";

export {
  text_disclaimer,
  text_menu,
  text_next,
  text_prev,
  text_note,
  text_end_help,
  text_search,
  text_search_help_prompt_desktop,
  text_search_no_result_desktop,
  text_search_help_prompt_mobile,
  text_search_no_result_mobile,
  text_survey_title,
  text_survey_question,
  text_user_message_question,
  text_submit,
  text_done,
  text_restart,
};
