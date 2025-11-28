import { SupportedLanguage } from '../types';

export interface Translations {
  // Common
  cancel: string;
  save: string;
  delete: string;
  edit: string;
  done: string;
  back: string;
  next: string;
  loading: string;
  error: string;
  success: string;
  retry: string;

  // Navigation
  navHome: string;
  navLessons: string;
  navSettings: string;

  // Home Screen
  homeTitle: string;
  homeSubtitle: string;
  myLectures: string;
  searchPlaceholder: string;
  noLectures: string;
  noLecturesInFolder: string;
  startRecording: string;
  sortByDate: string;
  sortByTitle: string;
  filterAll: string;
  filterRecorded: string;
  filterProcessing: string;
  filterProcessed: string;
  filterFailed: string;
  newFolder: string;
  folderName: string;
  deleteFolder: string;
  deleteFolderMessage: string;
  editLectureTitle: string;
  lectureTitle: string;

  // Record Screen
  recordTitle: string;
  recordButton: string;
  recordingInProgress: string;
  stopRecording: string;
  processing: string;
  processingLecture: string;
  generatingTitle: string;
  transcribing: string;
  generatingMaterials: string;
  generatingLesson: string;
  assembling: string;
  processingComplete: string;
  processingFailed: string;

  // Lecture Detail Screen
  lectureDetails: string;
  duration: string;
  summary: string;
  notes: string;
  flashcards: string;
  chat: string;
  lessonAvailable: string;
  createInteractiveLesson: string;
  startLesson: string;
  generateLesson: string;
  generatingLesson: string;
  askQuestion: string;
  sendMessage: string;
  noSummary: string;
  noNotes: string;
  noFlashcards: string;
  flipCard: string;
  cardCount: string;
  deleteConfirm: string;
  deleteMessage: string;
  lessonAlreadyExists: string;
  lessonExistsMessage: string;
  viewLesson: string;
  regenerate: string;

  // Lessons Screen
  lessonsTitle: string;
  lessonsSubtitle: string;
  filterActive: string;
  filterCompleted: string;
  noLessons: string;
  noLessonsMessage: string;
  questions: string;
  minutes: string;
  completed: string;
  score: string;

  // Lesson Take Screen
  lessonTab: string;
  quizTab: string;
  checkAnswer: string;
  nextQuestion: string;
  finishQuiz: string;
  correctAnswer: string;
  incorrectAnswer: string;
  explanation: string;
  quizComplete: string;
  yourScore: string;
  correctAnswers: string;
  backToLessons: string;
  trueOption: string;
  falseOption: string;

  // Settings Screen
  settingsTitle: string;
  apiKeySection: string;
  apiKeyDescription: string;
  apiKeyPlaceholder: string;
  saveKey: string;
  apiKeySaved: string;
  appLanguageSection: string;
  appLanguageDescription: string;
  lessonLanguageSection: string;
  lessonLanguageDescription: string;
  languageUpdated: string;
  languageEnglish: string;
  languageRussian: string;
  languageKazakh: string;

  // Onboarding Screen
  onboardingTitle: string;
  onboardingSubtitle: string;
  ageQuestion: string;
  ageDescription: string;
  ageInputPlaceholder: string;
  interestsQuestion: string;
  interestsDescription: string;
  addCustomInterest: string;
  addButton: string;
  selectedCount: string;
  getStarted: string;

  // Common Interests
  interestSports: string;
  interestMusic: string;
  interestArt: string;
  interestTechnology: string;
  interestScience: string;
  interestHistory: string;
  interestLiterature: string;
  interestGaming: string;
  interestMovies: string;
  interestCooking: string;
  interestTravel: string;
  interestFashion: string;
  interestPhotography: string;
  interestNature: string;
  interestMathematics: string;

  // Error Messages
  errorNetworkError: string;
  errorApiKeyMissing: string;
  errorApiKeyInvalid: string;
  errorRateLimit: string;
  errorUnknown: string;
  errorRetry: string;

  // Camera & Photos
  cameraTitle: string;
  takePhoto: string;
  selectFromGallery: string;
  noPhotosYet: string;
  takeOrSelectPhotos: string;
  noPhotosSelected: string;
  photoError: string;
  permissionDenied: string;
  cameraPermissionMessage: string;
  ok: string;
  skip: string;
  uploadPhotos: string;
  uploadPhotosQuestion: string;
  uploadPhotosMessage: string;
  photoUploadError: string;
}

const en: Translations = {
  // Common
  cancel: 'Cancel',
  save: 'Save',
  delete: 'Delete',
  edit: 'Edit',
  done: 'Done',
  back: 'Back',
  next: 'Next',
  loading: 'Loading...',
  error: 'Error',
  success: 'Success',
  retry: 'Retry',

  // Navigation
  navHome: 'Home',
  navLessons: 'Lessons',
  navSettings: 'Settings',

  // Home Screen
  homeTitle: 'My Lectures',
  homeSubtitle: 'Record and learn from your lectures',
  myLectures: 'My Lectures',
  searchPlaceholder: 'Search lectures...',
  noLectures: 'No lectures yet',
  noLecturesInFolder: 'No lectures in this folder.',
  startRecording: 'Start by recording a lecture',
  sortByDate: 'By Date',
  sortByTitle: 'By Title',
  filterAll: 'All',
  filterRecorded: 'Recorded',
  filterProcessing: 'Processing',
  filterProcessed: 'Processed',
  filterFailed: 'Failed',
  newFolder: 'New Folder',
  folderName: 'Folder Name',
  deleteFolder: 'Delete Folder',
  deleteFolderMessage: 'Are you sure you want to delete this folder? Lectures inside will be moved to the main list.',
  editLectureTitle: 'Edit Lecture Title',
  lectureTitle: 'Lecture Title',

  // Record Screen
  recordTitle: 'Record Lecture',
  recordButton: 'Start Recording',
  recordingInProgress: 'Recording in progress...',
  stopRecording: 'Stop Recording',
  processing: 'Processing',
  processingLecture: 'Processing your lecture...',
  generatingTitle: 'Generating title...',
  transcribing: 'Transcribing audio...',
  generatingMaterials: 'Generating study materials...',
  generatingLesson: 'Generating personalized lesson...',
  assembling: 'Finalizing...',
  processingComplete: 'Processing complete!',
  processingFailed: 'Processing failed',

  // Lecture Detail Screen
  lectureDetails: 'Lecture Details',
  duration: 'Duration',
  summary: 'Summary',
  notes: 'Notes',
  flashcards: 'Flashcards',
  chat: 'Chat',
  lessonAvailable: 'Lesson Available',
  createInteractiveLesson: 'Create Interactive Lesson',
  startLesson: 'Start Lesson',
  generateLesson: 'Generate Lesson',
  generatingLesson: 'Generating lesson...',
  askQuestion: 'Ask a question about this lecture...',
  sendMessage: 'Send',
  noSummary: 'No summary available',
  noNotes: 'No notes available',
  noFlashcards: 'No flashcards available',
  flipCard: 'Tap to flip',
  cardCount: 'Card',
  deleteConfirm: 'Delete Lecture',
  deleteMessage: 'Are you sure you want to delete this lecture? This action cannot be undone.',
  lessonAlreadyExists: 'Lesson Already Exists',
  lessonExistsMessage: 'A lesson already exists for this lecture. Would you like to view it or regenerate?',
  viewLesson: 'View Lesson',
  regenerate: 'Regenerate',

  // Lessons Screen
  lessonsTitle: 'My Lessons',
  lessonsSubtitle: 'Interactive lessons from your lectures',
  filterActive: 'Active',
  filterCompleted: 'Completed',
  noLessons: 'No lessons yet',
  noLessonsMessage: 'Lessons will appear here after processing lectures',
  questions: 'questions',
  minutes: 'min',
  completed: 'Completed',
  score: 'Score',

  // Lesson Take Screen
  lessonTab: 'Lesson',
  quizTab: 'Quiz',
  checkAnswer: 'Check Answer',
  nextQuestion: 'Next Question',
  finishQuiz: 'Finish Quiz',
  correctAnswer: 'Correct!',
  incorrectAnswer: 'Incorrect',
  explanation: 'Explanation',
  quizComplete: 'Quiz Complete!',
  yourScore: 'Your Score',
  correctAnswers: 'correct',
  backToLessons: 'Back to Lessons',
  trueOption: 'True',
  falseOption: 'False',

  // Settings Screen
  settingsTitle: 'Settings',
  apiKeySection: 'OpenAI API Key',
  apiKeyDescription: 'Enter your OpenAI API key to enable transcription and AI features. Your key is stored locally on your device.',
  apiKeyPlaceholder: 'sk-...',
  saveKey: 'Save Key',
  apiKeySaved: 'API Key saved!',
  appLanguageSection: 'App Language',
  appLanguageDescription: 'Choose the language for the app interface.',
  lessonLanguageSection: 'Lesson Language',
  lessonLanguageDescription: 'Choose the language for generated lessons. This affects all new lessons created from lectures.',
  languageUpdated: 'Language preference updated!',
  languageEnglish: 'English',
  languageRussian: 'Russian',
  languageKazakh: 'Kazakh',

  // Onboarding Screen
  onboardingTitle: 'Welcome to Nerdie!',
  onboardingSubtitle: "Let's personalize your learning experience",
  ageQuestion: 'How old are you?',
  ageDescription: 'This helps us tailor lessons to your level',
  ageInputPlaceholder: 'Enter your age',
  interestsQuestion: 'What are your interests?',
  interestsDescription: "We'll use these to create relatable examples in your lessons",
  addCustomInterest: 'Add your own interest',
  addButton: 'Add',
  selectedCount: 'Selected',
  getStarted: 'Get Started',

  // Common Interests
  interestSports: 'Sports',
  interestMusic: 'Music',
  interestArt: 'Art',
  interestTechnology: 'Technology',
  interestScience: 'Science',
  interestHistory: 'History',
  interestLiterature: 'Literature',
  interestGaming: 'Gaming',
  interestMovies: 'Movies',
  interestCooking: 'Cooking',
  interestTravel: 'Travel',
  interestFashion: 'Fashion',
  interestPhotography: 'Photography',
  interestNature: 'Nature',
  interestMathematics: 'Mathematics',

  // Error Messages
  errorNetworkError: 'Network connection failed. Please check your internet connection and try again.',
  errorApiKeyMissing: 'OpenAI API key is not configured. Please add your API key in Settings.',
  errorApiKeyInvalid: 'Invalid API key. Please check your OpenAI API key in Settings.',
  errorRateLimit: 'Rate limit exceeded. Please wait a moment and try again.',
  errorUnknown: 'An unexpected error occurred. Please try again.',
  errorRetry: 'Retry',

  // Camera & Photos
  cameraTitle: 'Take Photos',
  takePhoto: 'Take Photo',
  selectFromGallery: 'Select from Gallery',
  noPhotosYet: 'No photos yet',
  takeOrSelectPhotos: 'Take photos of your notes or select from gallery',
  noPhotosSelected: 'Please select at least one photo',
  photoError: 'Failed to process photo',
  permissionDenied: 'Permission Denied',
  cameraPermissionMessage: 'Camera permission is required to take photos. Please enable it in settings.',
  ok: 'OK',
  skip: 'Skip',
  uploadPhotos: 'Upload Photos',
  uploadPhotosQuestion: 'Upload Notes?',
  uploadPhotosMessage: 'Would you like to upload photos of your notes? This will help generate better study materials.',
  photoUploadError: 'Failed to upload photos',
};

const ru: Translations = {
  // Common
  cancel: 'Отмена',
  save: 'Сохранить',
  delete: 'Удалить',
  edit: 'Изменить',
  done: 'Готово',
  back: 'Назад',
  next: 'Далее',
  loading: 'Загрузка...',
  error: 'Ошибка',
  success: 'Успешно',
  retry: 'Повторить',

  // Navigation
  navHome: 'Главная',
  navLessons: 'Уроки',
  navSettings: 'Настройки',

  // Home Screen
  homeTitle: 'Мои лекции',
  homeSubtitle: 'Записывайте и изучайте свои лекции',
  myLectures: 'Мои лекции',
  searchPlaceholder: 'Поиск лекций...',
  noLectures: 'Пока нет лекций',
  noLecturesInFolder: 'В этой папке нет лекций.',
  startRecording: 'Начните с записи лекции',
  sortByDate: 'По дате',
  sortByTitle: 'По названию',
  filterAll: 'Все',
  filterRecorded: 'Записано',
  filterProcessing: 'Обработка',
  filterProcessed: 'Обработано',
  filterFailed: 'Ошибка',
  newFolder: 'Новая папка',
  folderName: 'Название папки',
  deleteFolder: 'Удалить папку',
  deleteFolderMessage: 'Вы уверены, что хотите удалить эту папку? Лекции из неё будут перемещены в основной список.',
  editLectureTitle: 'Изменить название лекции',
  lectureTitle: 'Название лекции',

  // Record Screen
  recordTitle: 'Запись лекции',
  recordButton: 'Начать запись',
  recordingInProgress: 'Идет запись...',
  stopRecording: 'Остановить запись',
  processing: 'Обработка',
  processingLecture: 'Обработка вашей лекции...',
  generatingTitle: 'Генерация заголовка...',
  transcribing: 'Расшифровка аудио...',
  generatingMaterials: 'Генерация учебных материалов...',
  generatingLesson: 'Генерация персонализированного урока...',
  assembling: 'Финализация...',
  processingComplete: 'Обработка завершена!',
  processingFailed: 'Ошибка обработки',

  // Lecture Detail Screen
  lectureDetails: 'Детали лекции',
  duration: 'Длительность',
  summary: 'Резюме',
  notes: 'Конспект',
  flashcards: 'Карточки',
  chat: 'Чат',
  lessonAvailable: 'Урок доступен',
  createInteractiveLesson: 'Создать интерактивный урок',
  startLesson: 'Начать урок',
  generateLesson: 'Создать урок',
  generatingLesson: 'Создание урока...',
  askQuestion: 'Задайте вопрос об этой лекции...',
  sendMessage: 'Отправить',
  noSummary: 'Резюме недоступно',
  noNotes: 'Конспект недоступен',
  noFlashcards: 'Карточки недоступны',
  flipCard: 'Нажмите, чтобы перевернуть',
  cardCount: 'Карточка',
  deleteConfirm: 'Удалить лекцию',
  deleteMessage: 'Вы уверены, что хотите удалить эту лекцию? Это действие нельзя отменить.',
  lessonAlreadyExists: 'Урок уже существует',
  lessonExistsMessage: 'Урок для этой лекции уже существует. Хотите просмотреть его или создать заново?',
  viewLesson: 'Просмотреть урок',
  regenerate: 'Создать заново',

  // Lessons Screen
  lessonsTitle: 'Мои уроки',
  lessonsSubtitle: 'Интерактивные уроки из ваших лекций',
  filterActive: 'Активные',
  filterCompleted: 'Завершенные',
  noLessons: 'Пока нет уроков',
  noLessonsMessage: 'Уроки появятся здесь после обработки лекций',
  questions: 'вопросов',
  minutes: 'мин',
  completed: 'Завершено',
  score: 'Результат',

  // Lesson Take Screen
  lessonTab: 'Урок',
  quizTab: 'Тест',
  checkAnswer: 'Проверить ответ',
  nextQuestion: 'Следующий вопрос',
  finishQuiz: 'Завершить тест',
  correctAnswer: 'Правильно!',
  incorrectAnswer: 'Неправильно',
  explanation: 'Объяснение',
  quizComplete: 'Тест завершен!',
  yourScore: 'Ваш результат',
  correctAnswers: 'правильно',
  backToLessons: 'Вернуться к урокам',
  trueOption: 'Верно',
  falseOption: 'Неверно',

  // Settings Screen
  settingsTitle: 'Настройки',
  apiKeySection: 'OpenAI API ключ',
  apiKeyDescription: 'Введите ваш OpenAI API ключ для активации транскрипции и AI функций. Ключ хранится локально на вашем устройстве.',
  apiKeyPlaceholder: 'sk-...',
  saveKey: 'Сохранить ключ',
  apiKeySaved: 'API ключ сохранен!',
  appLanguageSection: 'Язык приложения',
  appLanguageDescription: 'Выберите язык интерфейса приложения.',
  lessonLanguageSection: 'Язык уроков',
  lessonLanguageDescription: 'Выберите язык для создаваемых уроков. Это влияет на все новые уроки, созданные из лекций.',
  languageUpdated: 'Язык обновлен!',
  languageEnglish: 'English',
  languageRussian: 'Русский',
  languageKazakh: 'Қазақша',

  // Onboarding Screen
  onboardingTitle: 'Добро пожаловать в Nerdie!',
  onboardingSubtitle: 'Давайте персонализируем ваше обучение',
  ageQuestion: 'Сколько вам лет?',
  ageDescription: 'Это помогает нам адаптировать уроки под ваш уровень',
  ageInputPlaceholder: 'Введите ваш возраст',
  interestsQuestion: 'Каковы ваши интересы?',
  interestsDescription: 'Мы используем их для создания понятных примеров в ваших уроках',
  addCustomInterest: 'Добавьте свой интерес',
  addButton: 'Добавить',
  selectedCount: 'Выбрано',
  getStarted: 'Начать',

  // Common Interests
  interestSports: 'Спорт',
  interestMusic: 'Музыка',
  interestArt: 'Искусство',
  interestTechnology: 'Технологии',
  interestScience: 'Наука',
  interestHistory: 'История',
  interestLiterature: 'Литература',
  interestGaming: 'Игры',
  interestMovies: 'Фильмы',
  interestCooking: 'Кулинария',
  interestTravel: 'Путешествия',
  interestFashion: 'Мода',
  interestPhotography: 'Фотография',
  interestNature: 'Природа',
  interestMathematics: 'Математика',

  // Error Messages
  errorNetworkError: 'Ошибка подключения к сети. Проверьте интернет-соединение и попробуйте снова.',
  errorApiKeyMissing: 'OpenAI API ключ не настроен. Добавьте ваш API ключ в Настройках.',
  errorApiKeyInvalid: 'Неверный API ключ. Проверьте ваш OpenAI API ключ в Настройках.',
  errorRateLimit: 'Превышен лимит запросов. Подождите немного и попробуйте снова.',
  errorUnknown: 'Произошла неожиданная ошибка. Попробуйте снова.',
  errorRetry: 'Повторить',

  // Camera & Photos
  cameraTitle: 'Сделать фото',
  takePhoto: 'Сфотографировать',
  selectFromGallery: 'Выбрать из галереи',
  noPhotosYet: 'Пока нет фото',
  takeOrSelectPhotos: 'Сфотографируйте свои конспекты или выберите из галереи',
  noPhotosSelected: 'Пожалуйста, выберите хотя бы одно фото',
  photoError: 'Не удалось обработать фото',
  permissionDenied: 'Доступ запрещен',
  cameraPermissionMessage: 'Для съемки фото требуется разрешение камеры. Пожалуйста, включите его в настройках.',
  ok: 'ОК',
  skip: 'Пропустить',
  uploadPhotos: 'Загрузить фото',
  uploadPhotosQuestion: 'Загрузить конспекты?',
  uploadPhotosMessage: 'Хотите загрузить фото ваших конспектов? Это поможет создать лучшие учебные материалы.',
  photoUploadError: 'Не удалось загрузить фото',
};

const kk: Translations = {
  // Common
  cancel: 'Болдырмау',
  save: 'Сақтау',
  delete: 'Жою',
  edit: 'Өңдеу',
  done: 'Дайын',
  back: 'Артқа',
  next: 'Келесі',
  loading: 'Жүктелуде...',
  error: 'Қате',
  success: 'Сәтті',
  retry: 'Қайталау',

  // Navigation
  navHome: 'Басты бет',
  navLessons: 'Сабақтар',
  navSettings: 'Баптаулар',

  // Home Screen
  homeTitle: 'Менің дәрістерім',
  homeSubtitle: 'Дәрістерді жазып, оқып үйреніңіз',
  myLectures: 'Менің дәрістерім',
  searchPlaceholder: 'Дәрістерді іздеу...',
  noLectures: 'Әзірге дәріс жоқ',
  noLecturesInFolder: 'Бұл қалтада дәріс жоқ.',
  startRecording: 'Дәріс жазудан бастаңыз',
  sortByDate: 'Күні бойынша',
  sortByTitle: 'Атауы бойынша',
  filterAll: 'Барлығы',
  filterRecorded: 'Жазылған',
  filterProcessing: 'Өңдеу',
  filterProcessed: 'Өңделген',
  filterFailed: 'Қате',
  newFolder: 'Жаңа қалта',
  folderName: 'Қалта атауы',
  deleteFolder: 'Қалтаны жою',
  deleteFolderMessage: 'Бұл қалтаны жойғыңыз келе ме? Ішіндегі дәрістер негізгі тізімге көшіріледі.',
  editLectureTitle: 'Дәріс атауын өзгерту',
  lectureTitle: 'Дәріс атауы',

  // Record Screen
  recordTitle: 'Дәріс жазу',
  recordButton: 'Жазуды бастау',
  recordingInProgress: 'Жазу жүріп жатыр...',
  stopRecording: 'Жазуды тоқтату',
  processing: 'Өңдеу',
  processingLecture: 'Дәрісіңіз өңделуде...',
  generatingTitle: 'Тақырып жасалуда...',
  transcribing: 'Аудио жазылуда...',
  generatingMaterials: 'Оқу материалдары жасалуда...',
  generatingLesson: 'Жекелендірілген сабақ жасалуда...',
  assembling: 'Аяқталуда...',
  processingComplete: 'Өңдеу аяқталды!',
  processingFailed: 'Өңдеу қатесі',

  // Lecture Detail Screen
  lectureDetails: 'Дәріс мәліметтері',
  duration: 'Ұзақтығы',
  summary: 'Қорытынды',
  notes: 'Конспект',
  flashcards: 'Карточкалар',
  chat: 'Чат',
  lessonAvailable: 'Сабақ қолжетімді',
  createInteractiveLesson: 'Интерактивті сабақ жасау',
  startLesson: 'Сабақты бастау',
  generateLesson: 'Сабақ жасау',
  generatingLesson: 'Сабақ жасалуда...',
  askQuestion: 'Бұл дәріс туралы сұрақ қойыңыз...',
  sendMessage: 'Жіберу',
  noSummary: 'Қорытынды жоқ',
  noNotes: 'Конспект жоқ',
  noFlashcards: 'Карточкалар жоқ',
  flipCard: 'Аудару үшін басыңыз',
  cardCount: 'Карточка',
  deleteConfirm: 'Дәрісті жою',
  deleteMessage: 'Бұл дәрісті жойғыңыз келе ме? Бұл әрекетті қайтаруға болмайды.',
  lessonAlreadyExists: 'Сабақ бар',
  lessonExistsMessage: 'Бұл дәріс үшін сабақ бұрыннан бар. Көргіңіз келе ме немесе қайта жасауды қалайсыз ба?',
  viewLesson: 'Сабақты көру',
  regenerate: 'Қайта жасау',

  // Lessons Screen
  lessonsTitle: 'Менің сабақтарым',
  lessonsSubtitle: 'Дәрістеріңізден интерактивті сабақтар',
  filterActive: 'Белсенді',
  filterCompleted: 'Аяқталған',
  noLessons: 'Әзірге сабақ жоқ',
  noLessonsMessage: 'Дәрістер өңделгеннен кейін сабақтар осында пайда болады',
  questions: 'сұрақ',
  minutes: 'мин',
  completed: 'Аяқталған',
  score: 'Нәтиже',

  // Lesson Take Screen
  lessonTab: 'Сабақ',
  quizTab: 'Тест',
  checkAnswer: 'Жауапты тексеру',
  nextQuestion: 'Келесі сұрақ',
  finishQuiz: 'Тестті аяқтау',
  correctAnswer: 'Дұрыс!',
  incorrectAnswer: 'Қате',
  explanation: 'Түсіндірме',
  quizComplete: 'Тест аяқталды!',
  yourScore: 'Нәтижеңіз',
  correctAnswers: 'дұрыс',
  backToLessons: 'Сабақтарға оралу',
  trueOption: 'Ия',
  falseOption: 'Жоқ',

  // Settings Screen
  settingsTitle: 'Баптаулар',
  apiKeySection: 'OpenAI API кілті',
  apiKeyDescription: 'Транскрипция мен AI функцияларын іске қосу үшін OpenAI API кілтін енгізіңіз. Кілт құрылғыңызда сақталады.',
  apiKeyPlaceholder: 'sk-...',
  saveKey: 'Кілтті сақтау',
  apiKeySaved: 'API кілті сақталды!',
  appLanguageSection: 'Қосымша тілі',
  appLanguageDescription: 'Қосымша интерфейсінің тілін таңдаңыз.',
  lessonLanguageSection: 'Сабақ тілі',
  lessonLanguageDescription: 'Жасалатын сабақтардың тілін таңдаңыз. Бұл дәрістерден жасалған барлық жаңа сабақтарға әсер етеді.',
  languageUpdated: 'Тіл жаңартылды!',
  languageEnglish: 'English',
  languageRussian: 'Русский',
  languageKazakh: 'Қазақша',

  // Onboarding Screen
  onboardingTitle: 'Nerdie-ге қош келдіңіз!',
  onboardingSubtitle: 'Оқу тәжірибеңізді жекелендірейік',
  ageQuestion: 'Сіз неше жастасыз?',
  ageDescription: 'Бұл сабақтарды сіздің деңгейіңізге бейімдеуге көмектеседі',
  ageInputPlaceholder: 'Жасыңызды енгізіңіз',
  interestsQuestion: 'Сіздің қызығушылықтарыңыз қандай?',
  interestsDescription: 'Оларды сабақтарыңызда түсінікті мысалдар жасау үшін пайдаланамыз',
  addCustomInterest: 'Өз қызығушылығыңызды қосыңыз',
  addButton: 'Қосу',
  selectedCount: 'Таңдалған',
  getStarted: 'Бастау',

  // Common Interests
  interestSports: 'Спорт',
  interestMusic: 'Музыка',
  interestArt: 'Өнер',
  interestTechnology: 'Технология',
  interestScience: 'Ғылым',
  interestHistory: 'Тарих',
  interestLiterature: 'Әдебиет',
  interestGaming: 'Ойындар',
  interestMovies: 'Фильмдер',
  interestCooking: 'Ас әзірлеу',
  interestTravel: 'Саяхат',
  interestFashion: 'Сән',
  interestPhotography: 'Фотография',
  interestNature: 'Табиғат',
  interestMathematics: 'Математика',

  // Error Messages
  errorNetworkError: 'Желі қатесі. Интернет байланысын тексеріп, қайталап көріңіз.',
  errorApiKeyMissing: 'OpenAI API кілті бапталмаған. Баптауларда API кілтіңізді қосыңыз.',
  errorApiKeyInvalid: 'Қате API кілт. Баптауларда OpenAI API кілтіңізді тексеріңіз.',
  errorRateLimit: 'Сұраныс лимиті асты. Біраз күтіп, қайталап көріңіз.',
  errorUnknown: 'Күтпеген қате орын алды. Қайталап көріңіз.',
  errorRetry: 'Қайталау',

  // Camera & Photos
  cameraTitle: 'Фото түсіру',
  takePhoto: 'Фото түсіру',
  selectFromGallery: 'Галереядан таңдау',
  noPhotosYet: 'Әзірге фото жоқ',
  takeOrSelectPhotos: 'Конспектіңізді түсіріңіз немесе галереядан таңдаңыз',
  noPhotosSelected: 'Кем дегенде бір фото таңдаңыз',
  photoError: 'Фотоны өңдеу сәтсіз аяқталды',
  permissionDenied: 'Рұқсат берілмеді',
  cameraPermissionMessage: 'Фото түсіру үшін камера рұқсаты қажет. Баптауларда оны қосыңыз.',
  ok: 'ОК',
  skip: 'Өткізіп жіберу',
  uploadPhotos: 'Фото жүктеу',
  uploadPhotosQuestion: 'Конспекттерді жүктеу керек пе?',
  uploadPhotosMessage: 'Конспектіңіздің фотосын жүктегіңіз келе ме? Бұл жақсырақ оқу материалдарын жасауға көмектеседі.',
  photoUploadError: 'Фото жүктеу сәтсіз аяқталды',
};

export const translations: Record<SupportedLanguage, Translations> = {
  en,
  ru,
  kk,
};
