const copy = [
  ["Facts, descriptions, screenshots, and brand assets.", "Fiches techniques, descriptions, captures d’écran et éléments visuels.", "Informações, descrições, capturas de tela e materiais da marca."],
  ["Download complete kit (English)", "Télécharger le dossier complet (anglais)", "Baixar kit completo (inglês)"],
  ["The ZIP includes English text and original media files.", "Le ZIP contient les textes en anglais et les fichiers médias originaux.", "O ZIP inclui textos em inglês e arquivos de mídia originais."],
  ["Complete kit", "Dossier complet", "Kit completo"],
  ["Factsheet", "Fiche technique", "Ficha técnica"],
  ["Release windows refer to the planned full-game release.", "Les périodes de sortie indiquent la sortie prévue du jeu complet.", "As janelas de lançamento se referem ao lançamento previsto do jogo completo."],
  ["About the game.", "À propos du jeu.", "Sobre o jogo."],
  ["Please preserve logo proportions and colors.", "Veuillez conserver les proportions et les couleurs des logos.", "Preserve as proporções e cores dos logos."],
  ["PNG logo", "Logo PNG", "Logo PNG"],
  ["Visit game website", "Visiter le site du jeu", "Visitar o site do jogo"],
  ["Demo available · Full game Q1 2027", "Démo disponible · Jeu complet au T1 2027", "Demo disponível · Jogo completo no 1º trimestre de 2027"],
  ["Pre-release · Q4 2026", "Pré-lancement · T4 2026", "Pré-lançamento · 4º trimestre de 2026"],
  ["Psychological horror", "Horreur psychologique", "Terror psicológico"],
] as const;

export const desktopPressFrench = Object.fromEntries(copy.map(([source, fr]) => [source, fr]));
export const desktopPressPortuguese = Object.fromEntries(copy.map(([source, , pt]) => [source, pt]));
