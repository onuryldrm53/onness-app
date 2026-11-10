import { Language, WorkoutDifficulty, WorkoutDay } from '../types';

export const YEARLY_PHASES_DATA: Record<Language, Record<number, { name: string; desc: string; weeks: Record<number, { label: string; focus: string }> }>> = {
  tr: {
    1: {
      name: "1. Ay: Temel Adaptasyon & Giriş",
      desc: "Hafif ve sakatlıksız hacim, eklem sağlığı ve doğru form kalıplarını oturtma.",
      weeks: {
        1: { label: "1. Hafta: Temel Adaptasyon & Başlangıç", focus: "Doğru biyomekanik açıları yakalama, eklem ısınması ve sakin tempo." },
        2: { label: "2. Hafta: Sinir-Kas Aktivasyonu", focus: "Kas-zihin koordinasyonunu kurma, negatif inişleri kontrol etme ve gerilim süresini hissetme." },
        3: { label: "3. Hafta: Temel Dayanıklılık", focus: "Set aralarındaki toparlanma süresini kısaltarak kas içi laktat direncini başlatma." },
        4: { label: "4. Hafta: Temel Faz Sonu & Kontrol", focus: "İlk ayın form stabilitesini test etme ve 2. ayın hacim yüklemesine zemin hazırlama." }
      }
    },
    2: {
      name: "2. Ay: Hacim & Kapasite İnşası",
      desc: "Kas içi glikojen kapasitesini artırma, set ve tekrar temposunu yukarı çekme.",
      weeks: {
        1: { label: "1. Hafta: Hacim Yüklemesi Başlangıç", focus: "Artan tekrar aralıkları ile omuz ve triceps liflerinde hipertrofi uyarısı verme." },
        2: { label: "2. Hafta: Mekanik Gerilim Artışı", focus: "Hareketlerin tepe noktasında 1 saniye sıkıştırma uygulayarak kas içi kan akışını artırma." },
        3: { label: "3. Hafta: Kas Yoğunluğu İnşası", focus: "Sırt ve omuzda laktik asit eşiğini yukarı çekip setleri tükenişe yakın tamamlama." },
        4: { label: "4. Hafta: Hacim Fazı Zirvesi", focus: "2. ayın en yüksek toplam tekrar hacmine ulaşarak üst gövdede belirgin dolgunluk sağlama." }
      }
    },
    3: {
      name: "3. Ay: Güç, Direnç & V-Taper",
      desc: "Sırt kanatlarında derinleşme, patlayıcı itişler ve daha uzun süreli statik tutuşlar.",
      weeks: {
        1: { label: "1. Hafta: V-Taper Sırt & Güç Açılışı", focus: "Kanat kaslarını (lats) genişleten çekiş açılarına ve omuz genişliğine odaklanma." },
        2: { label: "2. Hafta: Negatif Tekrar Hakimiyeti", focus: "İniş fazlarını 3 saniyede tamamlayarak derin mikroyırtıklar ve lif uyarımı oluşturma." },
        3: { label: "3. Hafta: İtiş & Çekiş Güç Artışı", focus: "Pike şınavı ve dips hareketlerinde omuz eklemlerini kilitlemeden maksimum güç aktarımı." },
        4: { label: "4. Hafta: Güç & Dayanıklılık Zirvesi", focus: "V-Taper sırt estetiğini mühürleme ve 3. ayın nihai güç eşiğini aşma." }
      }
    },
    4: {
      name: "4. Ay: Yoğunluk & Deltoid Zirvesi",
      desc: "Omuz ve arka kolda yüksek mekanik gerilim, negatiflerde daha yavaş inişler.",
      weeks: {
        1: { label: "1. Hafta: Deltoid İzolasyonu", focus: "Ön, yan ve arka omuz başlarını ayrı açılarla hedefleyip küre formuna yaklaştırma." },
        2: { label: "2. Hafta: Triceps & Arka Hat Gerilimi", focus: "Kol arkası liflerinde yanma eşiğini zorlama ve itiş gücünü tepeye taşıma." },
        3: { label: "3. Hafta: Yüksek Yoğunluk Eşiği", focus: "Dinlenme aralıklarında nabzı kontrol edip kasları aralıksız gerilim altında tutma." },
        4: { label: "4. Hafta: İleri Seviye Omuz & Kol Zirvesi", focus: "Omuz ve triceps keskinliğini belirginleştirip heykel formuna geçiş yapma." }
      }
    },
    5: {
      name: "5. Ay: Çelik Core & Heykel Tanımlama",
      desc: "Derin karın duvarı, oblikler ve omurgada maksimum stabilite meydan okuması.",
      weeks: {
        1: { label: "1. Hafta: Çelik Karın & Derin Core", focus: "Transverse abdominis ve rektus kaslarını sıkarak karın duvarını içeri kilitleme." },
        2: { label: "2. Hafta: Oblik & Karın Duvarı Sertliği", focus: "Yan karın liflerini ve serratus kaslarını devreye sokup simetrik hatlar oluşturma." },
        3: { label: "3. Hafta: Statik Direnç Meydan Okuması", focus: "Hollow body ve plankte titremeyi kontrol altına alıp omurgayı kaya gibi sabitleme." },
        4: { label: "4. Hafta: Heykel Karın & Omurga Zirvesi", focus: "Karın kaslarında derin parçalanma, korse etkisi ve maksimum gövde sertliği." }
      }
    },
    6: {
      name: "6. Ay: Elit Atletik Pik & Zirve Kapanış",
      desc: "6 aylık büyük dönüşümün taçlandığı en üst düzey kas dayanıklılığı ve zafer.",
      weeks: {
        1: { label: "1. Hafta: Elit Seviye Açılışı", focus: "Son ayın yüksek tempo açılışı; kusursuz teknikle en sert setleri başlatma." },
        2: { label: "2. Hafta: Zirve Kas Dayanıklılığı", focus: "Tüm hareketlerde maksimum kapasiteye ulaşarak yorgunluğa karşı üstün direnç gösterme." },
        3: { label: "3. Hafta: Maksimum Kas Sıkıştırma", focus: "Her tekrarın tepe noktasında 2 saniye kilitlenme ve nihai estetik tanım." },
        4: { label: "4. Hafta: 6 Aylık Büyük Zafer & Final Form", focus: "24 haftalık şampiyonluk kapanışı! Elde ettiğin güç, estetik sırt, omuz ve çelik karnın zirvesi." }
      }
    }
  },
  en: {
    1: {
      name: "Month 1: Foundational Adaptation",
      desc: "Injury-free volume, joint health, and mastering strict biomechanical form.",
      weeks: {
        1: { label: "Week 1: Fundamentals & Initiation", focus: "Calibrating angles, warming up joints, and pacing steady cadences." },
        2: { label: "Week 2: Neuromuscular Activation", focus: "Mind-muscle connection, controlled eccentrics, and feeling time under tension." },
        3: { label: "Week 3: Muscular Endurance", focus: "Shortening recovery intervals to build lactate threshold and stamina." },
        4: { label: "Week 4: Foundation Milestone Test", focus: "Testing form stability and preparing joints for volume overloading." }
      }
    },
    2: {
      name: "Month 2: Hypertrophy & Capacity",
      desc: "Expanding muscular glycogen capacity, increasing repetition thresholds.",
      weeks: {
        1: { label: "Week 1: Volume Loading Initiation", focus: "Triggering hypertrophy cues across shoulders and triceps fibers." },
        2: { label: "Week 2: Mechanical Tension Spike", focus: "Holding 1-second peak contractions to drive cellular blood flow." },
        3: { label: "Week 3: Muscular Density Build", focus: "Pushing sets near technical failure across lats and shoulders." },
        4: { label: "Week 4: Volume Phase Peak", focus: "Achieving highest monthly rep volume for pronounced upper body fullness." }
      }
    },
    3: {
      name: "Month 3: Power, Density & V-Taper",
      desc: "Widening lat wings, explosive press mechanics, and prolonged static holds.",
      weeks: {
        1: { label: "Week 1: V-Taper Back & Power Kickoff", focus: "Targeting latissimus dorsi pull angles to build wide shoulder-to-waist taper." },
        2: { label: "Week 2: Negative Eccentric Mastery", focus: "3-second lowering tempos for intense micro-tear fiber recruitment." },
        3: { label: "Week 3: Push & Pull Strength Surge", focus: "Maximum kinetic power in pike push-ups and dips without joint locking." },
        4: { label: "Week 4: Strength & Stamina Climax", focus: "Locking down athletic back aesthetics and passing the strength milestone." }
      }
    },
    4: {
      name: "Month 4: High Intensity & 3D Delts",
      desc: "Peak mechanical tension in deltoids and triceps with slower eccentrics.",
      weeks: {
        1: { label: "Week 1: Deltoid Fiber Isolation", focus: "Isolating front, lateral, and rear delts for round 3D cannonball shoulders." },
        2: { label: "Week 2: Triceps Tension Overload", focus: "Challenging burn limits in posterior arm chains and lockout drive." },
        3: { label: "Week 3: Sustained Intensity Threshold", focus: "Controlling pulse between rests while maintaining unyielding tension." },
        4: { label: "Week 4: Advanced Shoulder & Arm Peak", focus: "Sculpting carved definition across upper arm and shoulder caps." }
      }
    },
    5: {
      name: "Month 5: Steel Core & Definition",
      desc: "Deep abdominal wall, obliques, and maximal spinal stability.",
      weeks: {
        1: { label: "Week 1: Deep Transverse Activation", focus: "Drawing the navel inward and locking the midsection like an iron corset." },
        2: { label: "Week 2: Oblique & Serratus Hardening", focus: "Engaging side abs and serratus lines for razor-sharp taper definition." },
        3: { label: "Week 3: Isometric Static Challenge", focus: "Subduing muscle tremors in hollow body and planks to lock a stone-like trunk." },
        4: { label: "Week 4: Chiseled Core & Spine Peak", focus: "Deep core separation, vacuum effect, and absolute torso stiffness." }
      }
    },
    6: {
      name: "Month 6: Elite Athletic Peak & Finale",
      desc: "The pinnacle of 6 months of hard work: peak conditioning and aesthetic glory.",
      weeks: {
        1: { label: "Week 1: Elite Phase Grand Opening", focus: "High-tempo kickoff executing the most challenging rep targets with flawless form." },
        2: { label: "Week 2: Peak Muscular Endurance", focus: "Reaching absolute highest volume capacity and defying systemic fatigue." },
        3: { label: "Week 3: Maximal Contraction Definition", focus: "2-second peak squeezes at the top of every rep for final aesthetic cuts." },
        4: { label: "Week 4: 6-Month Victory & Final Physique", focus: "24-week championship culmination! Celebrate your elite strength, V-taper, and iron core." }
      }
    }
  }
};

export const BASE_MONTH_TEMPLATE: Record<number, { weekBonusReps: number; weekBonusHold: number; days: WorkoutDay[] }> = {
  1: {
    weekBonusReps: 0,
    weekBonusHold: 0,
    days: [
      {
        dayName: { tr: "Pazartesi", en: "Monday" },
        focus: { tr: "Omuz & Triceps İtiş", en: "Shoulders & Triceps Push" },
        duration: "18-22 dk",
        exercises: [
          { name: { tr: "Pike Push-Up (Tepe Şınavı)", en: "Pike Push-Up" }, target: { tr: "Ön & Yan Omuz", en: "Front & Side Delts" }, form: { tr: "Kalçayı 'V' şeklinde yukarı it. Başını kontrollü olarak ellerin biraz ilerisine indir.", en: "Elevate hips into a 'V' shape. Lower crown of head slightly ahead of hands." }, sets: 3, reps: "5-6", type: "rep", postureId: "pike" },
          { name: { tr: "Sandalye / Sehpa Dips", en: "Chair / Bench Dips" }, target: { tr: "Arka Kol (Triceps)", en: "Triceps" }, form: { tr: "Sırtını sandalyeye yakın tut. Dirsekler hafif bükülene kadar in ve triceps ile it.", en: "Keep back close to bench. Lower until elbows hit ~90 degrees, press up." }, sets: 3, reps: "7-8", type: "rep", postureId: "dips" },
          { name: { tr: "Diz Üstü Elmas Şınav", en: "Kneeling Diamond Push-Up" }, target: { tr: "Triceps & İç Göğüs", en: "Triceps & Inner Chest" }, form: { tr: "Dizlerin yerde, eller göğüs altında üçgen. Dirsekleri vücuda yakın tutarak in.", en: "Knees grounded, form a diamond with hands below chest. Keep elbows tucked." }, sets: 3, reps: "6-7", type: "rep", postureId: "diamond" }
        ]
      },
      {
        dayName: { tr: "Salı", en: "Tuesday" },
        focus: { tr: "Sırt & Postür Çekiş", en: "Back & Posture Pull" },
        duration: "18-20 dk",
        exercises: [
          { name: { tr: "Yerde Havlu Çekişi (Floor Row)", en: "Floor Towel Row" }, target: { tr: "Kanat Kasları (Lats)", en: "Lats & Mid-Back" }, form: { tr: "Yüzüstü yat, havluyu iki yana gerip göğsüne doğru çek.", en: "Lie prone, pull towel apart laterally and row smoothly towards chest." }, sets: 3, reps: "8-9", type: "rep", postureId: "row" },
          { name: { tr: "Superman Tutuşu", en: "Superman Hold" }, target: { tr: "Alt Sırt & Bel", en: "Lower Back & Glutes" }, form: { tr: "Kollar ve bacakları hafifçe kaldırarak sırt kaslarını sık.", en: "Elevate arms and thighs off floor, squeeze spinal erectors and glutes." }, sets: 3, holdSeconds: 18, type: "timed", postureId: "superman" },
          { name: { tr: "Y-T-W Kaldırışları", en: "Y-T-W Raises" }, target: { tr: "Arka Omuz & Trapez", en: "Rear Delts & Traps" }, form: { tr: "Yüzüstü yatarken kollarla sırasıyla Y, T, W açıları oluştur.", en: "Lie prone, form Y, T, and W positions with thumbs pointing upward." }, sets: 3, reps: "8", type: "rep", postureId: "ytw" }
        ]
      },
      {
        dayName: { tr: "Çarşamba", en: "Wednesday" },
        focus: { tr: "Karın & Core Başlangıç", en: "Abs & Core Initiation" },
        duration: "16-18 dk",
        exercises: [
          { name: { tr: "Ön Kol Planki", en: "Forearm Plank" }, target: { tr: "Tüm Karın Bloğu", en: "Total Core Wall" }, form: { tr: "Dirsekler omuz altında, kalça sıkılı. Düz bir hat halinde dur.", en: "Elbows beneath shoulders, brace glutes and maintain rigid plank line." }, sets: 3, holdSeconds: 20, type: "timed", postureId: "plank" },
          { name: { tr: "Dead Bug (Ölü Böcek)", en: "Dead Bug" }, target: { tr: "Alt Karın & Core", en: "Lower Abs & Deep Core" }, form: { tr: "Sırtüstü yat, belini yere yapıştırıp zıt kol ve bacağı aç.", en: "Glue lower back to ground, extend opposite arm and leg synchronously." }, sets: 3, reps: "10", type: "rep", postureId: "deadbug" },
          { name: { tr: "Yavaş Dağ Tırmanışı", en: "Slow Mountain Climber" }, target: { tr: "Core & Dayanıklılık", en: "Core & Stamina" }, form: { tr: "Şınav pozisyonunda dizleri acele etmeden sırayla göğse çek.", en: "From high plank, rhythmically drive knees towards chest with control." }, sets: 3, holdSeconds: 18, type: "timed", postureId: "climber" }
        ]
      },
      {
        dayName: { tr: "Perşembe", en: "Thursday" },
        focus: { tr: "Aktif Toparlanma & Mobilite", en: "Active Recovery & Mobility" },
        duration: "14 dk",
        exercises: [
          { name: { tr: "Kedi - Deve Esnemesi", en: "Cat - Cow Stretch" }, target: { tr: "Omurga Mobilizasyonu", en: "Spinal Articulation" }, form: { tr: "Nefes alırken beli çukurlaştır, verirken sırtı kabart.", en: "Inhale arching lower back; exhale rounding thoracic spine smoothly." }, sets: 2, reps: "8", type: "rep", postureId: "catcow" },
          { name: { tr: "Çocuk Duruşu", en: "Child's Pose" }, target: { tr: "Kanat & Omuz Rahatlatma", en: "Lats & Shoulder Relief" }, form: { tr: "Kolları ileri uzatarak göğsü yere doğru bırak.", en: "Extend arms forward, sink hips to heels and breathe deeply." }, sets: 2, holdSeconds: 25, type: "timed", postureId: "child" }
        ]
      },
      {
        dayName: { tr: "Cuma", en: "Friday" },
        focus: { tr: "Sırt & Kol Güç", en: "Back & Arms Strength" },
        duration: "18-20 dk",
        exercises: [
          { name: { tr: "Kapı Pervazında Row", en: "Doorframe Row" }, target: { tr: "Kanat & Sırt", en: "Lats & Upper Back" }, form: { tr: "Pervaza tutunup hafif eğimle göğsü kapıya çek.", en: "Grip doorframe with lean, pull chest forward squeezing shoulder blades." }, sets: 3, reps: "8-9", type: "rep", postureId: "door" },
          { name: { tr: "Masa / Tezgah Triceps İtişi", en: "Desk / Bench Triceps Press" }, target: { tr: "Triceps", en: "Triceps" }, form: { tr: "Eller yüksekte, dirsekleri büküp kontrollü şekilde it.", en: "Hands on elevated surface, bend elbows and press back explosively." }, sets: 3, reps: "8-9", type: "rep", postureId: "benchtriceps" },
          { name: { tr: "Yüzücü Vuruşu", en: "Prone Swimmer Flutter" }, target: { tr: "Arka Zincir", en: "Posterior Chain" }, form: { tr: "Yüzüstü yatarken çapraz kol ve bacağı sakin tempoda kaldır.", en: "Lie prone, flutter opposite arm and leg in rhythmic cadences." }, sets: 3, holdSeconds: 18, type: "timed", postureId: "swimmer" }
        ]
      },
      {
        dayName: { tr: "Cumartesi", en: "Saturday" },
        focus: { tr: "Omuz & Core Kontrol", en: "Shoulders & Core Control" },
        duration: "18-20 dk",
        exercises: [
          { name: { tr: "Plank Omuz Dokunuşu", en: "Plank Shoulder Taps" }, target: { tr: "Omuz & Oblikler", en: "Shoulders & Anti-Rotation" }, form: { tr: "Kalçayı sallamadan sırayla elini zıt omuza götür.", en: "In high plank, touch opposite shoulder without swaying hips." }, sets: 3, reps: "10", type: "rep", postureId: "taps" },
          { name: { tr: "Standart Pike Push-Up", en: "Standard Pike Push-Up" }, target: { tr: "Omuz Başları", en: "Deltoid Caps" }, form: { tr: "Temiz ve sakin açıyla omuz basışı yap.", en: "Control lowering phase and push through palms overhead." }, sets: 3, reps: "5-6", type: "rep", postureId: "pike" },
          { name: { tr: "Hollow Body Tutuşu", en: "Hollow Body Hold" }, target: { tr: "Karın Duvarı", en: "Anterior Core Lock" }, form: { tr: "Beli yere yapıştır, bacakları hafif kaldır.", en: "Press lumbar into floor, lift shoulder blades and feet into banana shape." }, sets: 3, holdSeconds: 18, type: "timed", postureId: "hollow" }
        ]
      },
      {
        dayName: { tr: "Pazar", en: "Sunday" },
        focus: { tr: "Haftalık Dinlenme", en: "Weekly Rest & Repair" },
        duration: "Dinlenme",
        exercises: [
          { name: { tr: "Yürüyüş & Kas Onarımı", en: "Walk & Muscle Repair" }, target: { tr: "Toparlanma", en: "Active Recovery" }, form: { tr: "Haftayı tamamladın. Bol su tüket ve kaslarını toparla.", en: "Week complete! Hydrate well, stretch lightly, and prepare for next week." }, sets: 1, reps: "Dinlen", type: "rep", postureId: "rest" }
        ]
      }
    ]
  },
  2: {
    weekBonusReps: 1,
    weekBonusHold: 4,
    days: [
      {
        dayName: { tr: "Pazartesi", en: "Monday" },
        focus: { tr: "Omuz & Triceps İtiş", en: "Shoulders & Triceps Push" },
        duration: "20-24 dk",
        exercises: [
          { name: { tr: "Pike Push-Up", en: "Pike Push-Up" }, target: { tr: "Omuz Başları", en: "Deltoids" }, form: { tr: "Açıyı koruyarak kontrollü tekrar uygula.", en: "Maintain strict V-angle with deliberate eccentric tempo." }, sets: 3, reps: "6-7", type: "rep", postureId: "pike" },
          { name: { tr: "Sandalye Dips", en: "Chair Dips" }, target: { tr: "Triceps", en: "Triceps" }, form: { tr: "Dirsekleri 90 dereceye kadar indirip yukarı it.", en: "Lower smoothly to 90 degrees and lockout with triceps." }, sets: 3, reps: "8-9", type: "rep", postureId: "dips" },
          { name: { tr: "Diz Üstü Elmas Şınav", en: "Kneeling Diamond Push-Up" }, target: { tr: "Triceps & Göğüs", en: "Triceps & Chest" }, form: { tr: "Daha kontrollü ve net kasılma sağla.", en: "Focus on crisp inner chest and triceps squeeze." }, sets: 3, reps: "7-8", type: "rep", postureId: "diamond" }
        ]
      },
      {
        dayName: { tr: "Salı", en: "Tuesday" },
        focus: { tr: "Sırt & Postür Çekiş", en: "Back & Posture Pull" },
        duration: "20-22 dk",
        exercises: [
          { name: { tr: "Yerde Havlu Çekişi", en: "Floor Towel Row" }, target: { tr: "Kanatlar", en: "Lats" }, form: { tr: "Havluyu dışa çekerek kanatları daha sert sık.", en: "Rip towel apart laterally while squeezing rhomboids." }, sets: 3, reps: "10-11", type: "rep", postureId: "row" },
          { name: { tr: "Superman Tutuşu", en: "Superman Hold" }, target: { tr: "Bel & Sırt", en: "Lower Back" }, form: { tr: "Tepe noktada gerginliği koru.", en: "Lock extension at peak without hyperextending neck." }, sets: 3, holdSeconds: 22, type: "timed", postureId: "superman" },
          { name: { tr: "Y-T-W Kaldırışları", en: "Y-T-W Raises" }, target: { tr: "Arka Omuz", en: "Rear Delts" }, form: { tr: "Kürek kemiklerini birbirine iyice yaklaştır.", en: "Pinch shoulder blades firmly at the top of each letter." }, sets: 3, reps: "9-10", type: "rep", postureId: "ytw" }
        ]
      },
      {
        dayName: { tr: "Çarşamba", en: "Wednesday" },
        focus: { tr: "Karın & Core Gelişim", en: "Core Development" },
        duration: "18-20 dk",
        exercises: [
          { name: { tr: "Ön Kol Planki", en: "Forearm Plank" }, target: { tr: "Tüm Karın", en: "Total Abs" }, form: { tr: "Gövdeyi bir ok gibi düz tut.", en: "Maintain straight arrow spinal line with zero sagging." }, sets: 3, holdSeconds: 25, type: "timed", postureId: "plank" },
          { name: { tr: "Dead Bug", en: "Dead Bug" }, target: { tr: "Alt Karın", en: "Lower Core" }, form: { tr: "Kontrollü açılış ve kapanış.", en: "Synchronized extension while anchoring lumbar spine." }, sets: 3, reps: "12", type: "rep", postureId: "deadbug" },
          { name: { tr: "Dağ Tırmanışı", en: "Mountain Climber" }, target: { tr: "Core & Omuz", en: "Core & Shoulders" }, form: { tr: "Ritmik tempoyu koru.", en: "Maintain steady cadence while stabilizing shoulder blades." }, sets: 3, holdSeconds: 22, type: "timed", postureId: "climber" }
        ]
      },
      {
        dayName: { tr: "Perşembe", en: "Thursday" },
        focus: { tr: "Mobilite", en: "Mobility & Stretch" },
        duration: "14 dk",
        exercises: [
          { name: { tr: "Kedi - Deve Esnemesi", en: "Cat - Cow" }, target: { tr: "Omurga", en: "Spine" }, form: { tr: "Derin nefeslerle omurgayı rahatlat.", en: "Synchronize deep belly breaths with smooth spinal flow." }, sets: 2, reps: "10", type: "rep", postureId: "catcow" },
          { name: { tr: "Çocuk Duruşu", en: "Child's Pose" }, target: { tr: "Omuz Rahatlatma", en: "Shoulder Relief" }, form: { tr: "Sırtını uzat ve dinlendir.", en: "Lengthen spine and decompress upper back muscles." }, sets: 2, holdSeconds: 30, type: "timed", postureId: "child" }
        ]
      },
      {
        dayName: { tr: "Cuma", en: "Friday" },
        focus: { tr: "Sırt & Kol", en: "Back & Arms" },
        duration: "20-24 dk",
        exercises: [
          { name: { tr: "Kapı Çekişi", en: "Doorway Row" }, target: { tr: "Kanat", en: "Lats" }, form: { tr: "Açıyı biraz daha derinleştir.", en: "Increase lean angle for higher pulling resistance." }, sets: 3, reps: "9-10", type: "rep", postureId: "door" },
          { name: { tr: "Masa Triceps İtişi", en: "Desk Triceps Press" }, target: { tr: "Triceps", en: "Triceps" }, form: { tr: "Tepe noktada triceps'i 1 saniye sık.", en: "Squeeze triceps for 1 full second at peak extension." }, sets: 3, reps: "9-10", type: "rep", postureId: "benchtriceps" },
          { name: { tr: "Yüzücü Vuruşu", en: "Prone Swimmer" }, target: { tr: "Arka Hat", en: "Posterior Chain" }, form: { tr: "Tempolu vuruşlar.", en: "Controlled rhythmic fluttering with straight knees." }, sets: 3, holdSeconds: 22, type: "timed", postureId: "swimmer" }
        ]
      },
      {
        dayName: { tr: "Cumartesi", en: "Saturday" },
        focus: { tr: "Omuz & Core", en: "Shoulders & Core" },
        duration: "20-22 dk",
        exercises: [
          { name: { tr: "Plank Omuz Dokunuşu", en: "Shoulder Tap Plank" }, target: { tr: "Omuz & Core", en: "Anti-Rotation" }, form: { tr: "Sallantısız temiz tekrar.", en: "Clean taps with unwavering hip stability." }, sets: 3, reps: "12", type: "rep", postureId: "taps" },
          { name: { tr: "Pike Push-Up", en: "Pike Push-Up" }, target: { tr: "Omuz", en: "Shoulders" }, form: { tr: "Yavaş iniş, kontrollü kalkış.", en: "Controlled eccentric lowering and solid press." }, sets: 3, reps: "6-7", type: "rep", postureId: "pike" },
          { name: { tr: "Hollow Body", en: "Hollow Body Hold" }, target: { tr: "Karın Duvarı", en: "Abdominal Wall" }, form: { tr: "Bel boşluğunu kapatarak dur.", en: "Eliminate lumbar gap and sustain tension." }, sets: 3, holdSeconds: 22, type: "timed", postureId: "hollow" }
        ]
      },
      {
        dayName: { tr: "Pazar", en: "Sunday" },
        focus: { tr: "Dinlenme", en: "Rest & Recovery" },
        duration: "Dinlenme",
        exercises: [
          { name: { tr: "Kas Onarımı", en: "Recovery" }, target: { tr: "Toparlanma", en: "Restoration" }, form: { tr: "İkinci hafta geride kaldı. Harika gidiyorsun!", en: "Second week crushed! Replenish fluids and rest up." }, sets: 1, reps: "Dinlen", type: "rep", postureId: "rest" }
        ]
      }
    ]
  },
  3: {
    weekBonusReps: 2,
    weekBonusHold: 8,
    days: [
      {
        dayName: { tr: "Pazartesi", en: "Monday" },
        focus: { tr: "Omuz & Triceps Güç", en: "Shoulders & Triceps Strength" },
        duration: "22-26 dk",
        exercises: [
          { name: { tr: "Pike Push-Up", en: "Pike Push-Up" }, target: { tr: "Omuzlar", en: "Delts" }, form: { tr: "Açıyı bozmadan derin iniş yap.", en: "Lower deeper into the inverted triangle pocket." }, sets: 4, reps: "7-8", type: "rep", postureId: "pike" },
          { name: { tr: "Sandalye Dips", en: "Chair Dips" }, target: { tr: "Triceps", en: "Triceps" }, form: { tr: "Tepe kilitlenmesiyle güçlü basış.", en: "Powerful press into complete elbow lockout." }, sets: 4, reps: "10-11", type: "rep", postureId: "dips" },
          { name: { tr: "Standart / Diz Üstü Elmas", en: "Diamond Push-Up" }, target: { tr: "Triceps", en: "Triceps" }, form: { tr: "Dirsekleri içeri yakın tut.", en: "Keep elbows pinned along ribs for triceps loading." }, sets: 3, reps: "8-9", type: "rep", postureId: "diamond" }
        ]
      },
      {
        dayName: { tr: "Salı", en: "Tuesday" },
        focus: { tr: "Geniş Sırt Çekiş", en: "Wide Lat Pull" },
        duration: "22-26 dk",
        exercises: [
          { name: { tr: "Yerde Havlu Çekişi", en: "Floor Towel Row" }, target: { tr: "Kanat Kasları", en: "Lats" }, form: { tr: "Çekerken kanatları 2 saniye sık.", en: "Squeeze lats for 2 full seconds at peak retraction." }, sets: 4, reps: "11-12", type: "rep", postureId: "row" },
          { name: { tr: "Superman Tutuşu", en: "Superman Hold" }, target: { tr: "Bel & Sırt", en: "Spinal Chain" }, form: { tr: "Kesintisiz ve yay gibi tut.", en: "Hold taut bow shape with steady breathing." }, sets: 3, holdSeconds: 26, type: "timed", postureId: "superman" },
          { name: { tr: "Y-T-W Kaldırışları", en: "Y-T-W Raises" }, target: { tr: "Arka Omuz", en: "Rear Delts" }, form: { tr: "Açıları net çizerek yap.", en: "Draw clean angles and isolate lower traps." }, sets: 3, reps: "10-11", type: "rep", postureId: "ytw" }
        ]
      },
      {
        dayName: { tr: "Çarşamba", en: "Wednesday" },
        focus: { tr: "Taş Gibi Core", en: "Iron Core" },
        duration: "20-24 dk",
        exercises: [
          { name: { tr: "Ön Kol Planki", en: "Forearm Plank" }, target: { tr: "Tüm Karın", en: "Core Lock" }, form: { tr: "Düz ve titremeden dur.", en: "Immovable plank hold resisting all sagittal movement." }, sets: 4, holdSeconds: 28, type: "timed", postureId: "plank" },
          { name: { tr: "Dead Bug", en: "Dead Bug" }, target: { tr: "Alt Karın", en: "Lower Core" }, form: { tr: "Kontrollü uzanma.", en: "Full limb reach without lifting lumbar curve." }, sets: 3, reps: "14", type: "rep", postureId: "deadbug" },
          { name: { tr: "Dağ Tırmanışı", en: "Mountain Climber" }, target: { tr: "Core & Omuz", en: "Core Conditioning" }, form: { tr: "Tempolu sürdür.", en: "Sustain rapid yet controlled knee drives." }, sets: 3, holdSeconds: 25, type: "timed", postureId: "climber" }
        ]
      },
      {
        dayName: { tr: "Perşembe", en: "Thursday" },
        focus: { tr: "Mobilite", en: "Mobility" },
        duration: "14 dk",
        exercises: [
          { name: { tr: "Kedi - Deve Esnemesi", en: "Cat - Cow" }, target: { tr: "Omurga", en: "Spine" }, form: { tr: "Yavaş ve ritmik.", en: "Slow and fluid spinal waves." }, sets: 3, reps: "10", type: "rep", postureId: "catcow" },
          { name: { tr: "Çocuk Duruşu", en: "Child's Pose" }, target: { tr: "Sırt & Omuz", en: "Back & Shoulders" }, form: { tr: "Tamamen gevşe.", en: "Release all tension in latissimus and shoulders." }, sets: 2, holdSeconds: 35, type: "timed", postureId: "child" }
        ]
      },
      {
        dayName: { tr: "Cuma", en: "Friday" },
        focus: { tr: "Sırt & Kol", en: "Back & Arms" },
        duration: "22-26 dk",
        exercises: [
          { name: { tr: "Kapı Çerçevesi Row", en: "Doorframe Row" }, target: { tr: "Kanat", en: "Lats" }, form: { tr: "Temiz ve güçlü çekiş.", en: "Crisp and forceful lat contraction." }, sets: 4, reps: "10-11", type: "rep", postureId: "door" },
          { name: { tr: "Masa Triceps İtişi", en: "Desk Triceps Press" }, target: { tr: "Triceps", en: "Triceps" }, form: { tr: "Dirsekleri içeriye yakın tut.", en: "Maintain inward elbow tracking for direct loading." }, sets: 3, reps: "10-11", type: "rep", postureId: "benchtriceps" },
          { name: { tr: "Yüzücü Vuruşu", en: "Swimmer Flutter" }, target: { tr: "Arka Zincir", en: "Posterior Chain" }, form: { tr: "Ritmik çalışma.", en: "Smooth endurance cadence with high glute tension." }, sets: 3, holdSeconds: 25, type: "timed", postureId: "swimmer" }
        ]
      },
      {
        dayName: { tr: "Cumartesi", en: "Saturday" },
        focus: { tr: "Omuz & Core Zirvesi", en: "Shoulder & Core Apex" },
        duration: "22-25 dk",
        exercises: [
          { name: { tr: "Plank Omuz Tap", en: "Plank Shoulder Taps" }, target: { tr: "Omuz & Core", en: "Shoulders & Core" }, form: { tr: "Gövdeyi kıpırdatmadan dokun.", en: "Zero hip sway while alternating shoulder taps." }, sets: 3, reps: "14", type: "rep", postureId: "taps" },
          { name: { tr: "Pike Push-Up", en: "Pike Push-Up" }, target: { tr: "Omuz", en: "Shoulders" }, form: { tr: "Net omuz basışı.", en: "Sharp vertical drive pushing through palms." }, sets: 3, reps: "7-8", type: "rep", postureId: "pike" },
          { name: { tr: "Hollow Body", en: "Hollow Body" }, target: { tr: "Karın Duvarı", en: "Abdominal Wall" }, form: { tr: "Kesintisiz tut.", en: "Unbroken hollow hold with toes pointed." }, sets: 3, holdSeconds: 25, type: "timed", postureId: "hollow" }
        ]
      },
      {
        dayName: { tr: "Pazar", en: "Sunday" },
        focus: { tr: "Dinlenme", en: "Rest Day" },
        duration: "Dinlenme",
        exercises: [
          { name: { tr: "Toparlanma", en: "Recovery" }, target: { tr: "Rejenerasyon", en: "Rejuvenation" }, form: { tr: "Son haftaya geçmeden önce kasları dinlendir.", en: "Prime muscles for the upcoming milestone week." }, sets: 1, reps: "Dinlen", type: "rep", postureId: "rest" }
        ]
      }
    ]
  },
  4: {
    weekBonusReps: 3,
    weekBonusHold: 12,
    days: [
      {
        dayName: { tr: "Pazartesi", en: "Monday" },
        focus: { tr: "Zirve Omuz & Triceps", en: "Peak Shoulders & Triceps" },
        duration: "25-30 dk",
        exercises: [
          { name: { tr: "Pike Push-Up", en: "Pike Push-Up" }, target: { tr: "Omuz", en: "Shoulders" }, form: { tr: "Temiz tekrarla omuzları yak.", en: "High-rep burnout with immaculate deltoid drive." }, sets: 4, reps: "8-9", type: "rep", postureId: "pike" },
          { name: { tr: "Sandalye Dips", en: "Chair Dips" }, target: { tr: "Triceps", en: "Triceps" }, form: { tr: "Derin iniş ve patlayıcı itiş.", en: "Deep dip depth paired with explosive extension." }, sets: 4, reps: "11-12", type: "rep", postureId: "dips" },
          { name: { tr: "Elmas Şınav", en: "Diamond Push-Up" }, target: { tr: "Triceps & Göğüs", en: "Triceps & Chest" }, form: { tr: "Maksimum kontrol.", en: "Full depth and strict lockouts." }, sets: 3, reps: "8-9", type: "rep", postureId: "diamond" }
        ]
      },
      {
        dayName: { tr: "Salı", en: "Tuesday" },
        focus: { tr: "V-Taper Geniş Sırt", en: "V-Taper Lat Wings" },
        duration: "25-30 dk",
        exercises: [
          { name: { tr: "Yerde Havlu Çekişi", en: "Floor Towel Row" }, target: { tr: "Dış Kanat", en: "Outer Lats" }, form: { tr: "Havluyu güçlüce gererek çek.", en: "High-intensity lateral towel tension throughout." }, sets: 4, reps: "12-14", type: "rep", postureId: "row" },
          { name: { tr: "Superman Tutuşu", en: "Superman Hold" }, target: { tr: "Bel & Sırt", en: "Lower Back" }, form: { tr: "Sağlam tutuş.", en: "High arch extension hold with rock-solid glutes." }, sets: 3, holdSeconds: 30, type: "timed", postureId: "superman" },
          { name: { tr: "Y-T-W Kaldırışları", en: "Y-T-W Raises" }, target: { tr: "Arka Omuz", en: "Rear Delts" }, form: { tr: "Sıkıştırma ve kontrol.", en: "Deliberate 1-second contractions per letter." }, sets: 3, reps: "12", type: "rep", postureId: "ytw" }
        ]
      },
      {
        dayName: { tr: "Çarşamba", en: "Wednesday" },
        focus: { tr: "Çelik Karın", en: "Steel Core" },
        duration: "22-26 dk",
        exercises: [
          { name: { tr: "Ön Kol Planki", en: "Forearm Plank" }, target: { tr: "Tüm Core", en: "Total Core" }, form: { tr: "Sağlam şampiyon planki.", en: "Championship plank: relentless abdominal wall stiffness." }, sets: 3, holdSeconds: 35, type: "timed", postureId: "plank" },
          { name: { tr: "Dead Bug", en: "Dead Bug" }, target: { tr: "Alt Karın", en: "Deep Abs" }, form: { tr: "Yavaş açılış ve tam gerilim.", en: "Slow elongation keeping lower back glued down." }, sets: 3, reps: "16", type: "rep", postureId: "deadbug" },
          { name: { tr: "Dağ Tırmanışı", en: "Mountain Climber" }, target: { tr: "Core & Kondisyon", en: "Conditioning" }, form: { tr: "Kesintisiz sürdür.", en: "Continuous tempo maintaining stable posture." }, sets: 3, holdSeconds: 30, type: "timed", postureId: "climber" }
        ]
      },
      {
        dayName: { tr: "Perşembe", en: "Thursday" },
        focus: { tr: "Mobilite", en: "Mobility" },
        duration: "14 dk",
        exercises: [
          { name: { tr: "Kedi - Deve", en: "Cat - Cow" }, target: { tr: "Omurga", en: "Spinal Waves" }, form: { tr: "Derin nefesler.", en: "Deep lungful breaths through spine." }, sets: 3, reps: "10", type: "rep", postureId: "catcow" },
          { name: { tr: "Çocuk Duruşu", en: "Child's Pose" }, target: { tr: "Omuz & Kanat", en: "Lats & Shoulders" }, form: { tr: "Gevşe ve uzat.", en: "Deep restorative opening." }, sets: 2, holdSeconds: 35, type: "timed", postureId: "child" }
        ]
      },
      {
        dayName: { tr: "Cuma", en: "Friday" },
        focus: { tr: "Sırt & Kol Bitiş", en: "Back & Arms Finale" },
        duration: "25-30 dk",
        exercises: [
          { name: { tr: "Kapı Row", en: "Doorframe Row" }, target: { tr: "Kanat", en: "Lats" }, form: { tr: "Net çekiş.", en: "Explosive pull and controlled return." }, sets: 4, reps: "11-12", type: "rep", postureId: "door" },
          { name: { tr: "Masa Triceps", en: "Desk Triceps" }, target: { tr: "Triceps", en: "Triceps" }, form: { tr: "Tepe sıkıştırmalı itiş.", en: "High peak squeeze extension." }, sets: 3, reps: "11-12", type: "rep", postureId: "benchtriceps" },
          { name: { tr: "Yüzücü Vuruşu", en: "Swimmer Flutter" }, target: { tr: "Arka Hat", en: "Posterior Chain" }, form: { tr: "Tempolu.", en: "Fast-paced sustained fluttering." }, sets: 3, holdSeconds: 30, type: "timed", postureId: "swimmer" }
        ]
      },
      {
        dayName: { tr: "Cumartesi", en: "Saturday" },
        focus: { tr: "Zafer Antrenmanı", en: "Victory Workout" },
        duration: "25-30 dk",
        exercises: [
          { name: { tr: "Pike Push-Up", en: "Pike Push-Up" }, target: { tr: "Omuz Başları", en: "Deltoid Peak" }, form: { tr: "Zirve omuz yüklemesi.", en: "Peak shoulder loading with crisp reps." }, sets: 4, reps: "8-10", type: "rep", postureId: "pike" },
          { name: { tr: "Plank Omuz Tap", en: "Plank Shoulder Taps" }, target: { tr: "Omuz & Core", en: "Core Balance" }, form: { tr: "Net ve titremeden.", en: "Unshakeable anti-rotation shoulder taps." }, sets: 3, reps: "16", type: "rep", postureId: "taps" },
          { name: { tr: "Hollow Body", en: "Hollow Body" }, target: { tr: "Karın Duvarı", en: "Abdominal Lock" }, form: { tr: "Dayanarak ayı tamamla.", en: "Hold strong and finish the month's final set." }, sets: 3, holdSeconds: 30, type: "timed", postureId: "hollow" }
        ]
      },
      {
        dayName: { tr: "Pazar", en: "Sunday" },
        focus: { tr: "Aylık Dinlenme & Değerlendirme", en: "Monthly Review & Rest" },
        duration: "Zafer",
        exercises: [
          { name: { tr: "Toparlanma & Gurur", en: "Proud Recovery" }, target: { tr: "Tüm Vücut", en: "Total Body" }, form: { tr: "Bu ayki hedefini tamamladın. Kilo grafiğini kontrol et ve bir sonraki aya hazır ol!", en: "Month completed! Check your weight trend and get ready for the next phase!" }, sets: 1, reps: "Tebrikler!", type: "rep", postureId: "rest" }
        ]
      }
    ]
  }
};

export const REAL_EXERCISE_PHOTOS: Record<string, string> = {
  pike: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80",
  dips: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
  diamond: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
  row: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=800&q=80",
  superman: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
  ytw: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
  plank: "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80",
  deadbug: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
  climber: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=800&q=80",
  catcow: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
  child: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80",
  door: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80",
  benchtriceps: "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?auto=format&fit=crop&w=800&q=80",
  taps: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
  swimmer: "https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?auto=format&fit=crop&w=800&q=80",
  hollow: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
  rest: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"
};

export const EXERCISE_SPECIFIC_NOTES: Record<Language, Record<string, string[]>> = {
  tr: {
    pike: [
      "Başını doğrudan aşağı değil, ellerin 15-20 cm ilerisine doğru bir üçgen tepe oluşturacak şekilde indir.",
      "Ağırlığın büyük kısmını bacaklarda değil, omuz başlarında ve avuç içlerinde hisset.",
      "İnerken nefes al, tepeye doğru basarken kalçayı tavana iterek nefes ver."
    ],
    dips: [
      "Sırtını arkadaki sandalyeye/sehpaya olabildiğince yakın tut; öne kayarsan omuz eklemine aşırı yük biner.",
      "Dirsekleri asla yana doğru açma; doğrudan geriye doğru bükülsünler.",
      "İtiş anında triceps kaslarını 1 saniye güçlüce sıkarak tepe kilitlenmeyi yakala."
    ],
    diamond: [
      "İşaret ve baş parmaklarınla göğsünün tam altında üçgen (elmas) formu oluştur.",
      "Dirseklerini gövdenin iki yanına paralel tut; açıldıkça omuz baskısı artar, kapalı kaldıkça triceps alev alır.",
      "Belin aşağı sarkmasına izin verme; kalça ve karnı set boyunca sıkı tut."
    ],
    row: [
      "Havluyu iki elinle dışa doğru koparmaya çalışırcasına gergin tut; kanat kaslarındaki aktivasyonu ikiye katlar.",
      "Çekişi kollarla değil, kürek kemiklerini arkada birbirine ezerek başlat.",
      "Tepe çekiş noktasında 1-2 saniye duraklayıp sırtındaki lifleri kasılma halinde hisset."
    ],
    superman: [
      "Kafanı geriye doğru aşırı büküp boynunu sıkıştırma; bakışların hafifçe yere baksın.",
      "Kolları ve bacakları yukarı kaldırırken aynı anda kalça kaslarını da güçlü şekilde kilitle.",
      "Nefesini tutma; diyaframından sakin ve ritmik nefes alıp ver."
    ],
    ytw: [
      "Kolları Y, T ve W açılarında açarken baş parmakların daima tavanı göstersin.",
      "Omuzlarını kulaklarına doğru çekme; kürek kemiklerini aşağı ve içeri doğru bastır.",
      "Her harf formunda 1 saniye tepe sıkıştırma ile arka omuz liflerini uyar."
    ],
    plank: [
      "Dirseklerin tam olarak omuz başlarının hizasında olsun.",
      "Kalçayı ne çok yukarı dik ne de aşağı düşür; topuklardan başa tek bir düz çizgi oluştur.",
      "Göbeğini omurgana doğru içeri çek ve kalça kaslarını taş gibi sık."
    ],
    deadbug: [
      "Hareketteki en önemli kural: Bel çukurun zeminle asla temasını kaybetmemeli, sıfır boşluk.",
      "Zıt kol ve bacağı açarken çok hızlı gitme; 2 saniye iniş, 1 saniye toparlanma temposunu koru.",
      "Bacağını uzatırken karın duvarından kuvvetli nefes ver."
    ],
    climber: [
      "Hızlı ve kontrolsüzce koşmak yerine; dizini göğsüne kontrollü çekip karın kasını sıkıştır.",
      "Omuzlarının bileklerin tam üzerinde sabit kalmasına dikkat et, arkaya kaçma.",
      "Gövdenin sağa sola savrulmasını engelleyerek merkez stabiliteni koru."
    ],
    hollow: [
      "Belini yere tamamen yapıştır; altından el geçmeyecek şekilde omurgayı kilitle.",
      "Kollar geride zorluyorsa kolları öne veya dizlerini hafif bükerek açıyı kontrol altına al.",
      "Kürek kemiklerini yerden 2-3 cm havada tutarak üst karın gerilimini koru."
    ],
    catcow: [
      "Hareket hız odaklı değildir; her nefesle omurganın tek tek omurlarını hisset.",
      "Nefes alırken göğsü aç ve beli nazikçe çukurlaştır; nefes verirken sırtı kedi gibi kubbeleştir."
    ],
    child: [
      "Kolları olabildiğince ileri uzatıp göğsünü zemine doğru ağırlaştır.",
      "Kanat kaslarının ve omuz kuşağının uzayıp rahatladığını hissederek derin nefesler al."
    ],
    door: [
      "Kapı pervazına sağlam tutun; gövdeni arkaya bırakıp topuklar üzerinde sabit dur.",
      "Dirseğini geriye çekerek göğsünü pervaza yaklaştır, kanat kasını sık."
    ],
    benchtriceps: [
      "Masa veya yüksek tezgahta dirsekleri içeri kapalı tutarak alnını masaya doğru yaklaştır.",
      "Yalnızca dirsek eklemini açıp kapatarak tüm itişi arka kola yükle."
    ],
    taps: [
      "Elini karşı omuza götürürken kalçanın sağa sola sallanmasını sıfıra indir.",
      "Dengeyi sağlamak için ayaklarını omuz genişliğinden biraz daha açık tutabilirsin."
    ],
    swimmer: [
      "Yüzüstü ritmik çapraz kol-bacak kaldırışlarında dizlerini bükmeden kalçadan güç al.",
      "Sırt zincirindeki sürekli hafif gerilim postürünü dikleştirecektir."
    ]
  },
  en: {
    pike: [
      "Lower head slightly ahead of hands to form a tripod apex rather than dropping straight down.",
      "Load the majority of bodyweight into your deltoids and palms rather than the lower body.",
      "Inhale on descent; exhale forcefully while driving hips up to ceiling."
    ],
    dips: [
      "Keep your back close to the bench to avoid excessive shearing strain on shoulder joints.",
      "Never flare elbows out sideways; track them straight backward.",
      "Contract triceps forcefully for 1 second at peak lockout."
    ],
    diamond: [
      "Form a triangle/diamond with index fingers and thumbs beneath center chest.",
      "Keep elbows tucked close to torso; flaring increases shoulder stress, tucking fires triceps.",
      "Avoid lumbar sag; maintain tight core and glutes throughout each rep."
    ],
    row: [
      "Pull the towel apart laterally with full effort to double lat activation.",
      "Initiate the pull by crushing shoulder blades together rather than yanking with forearms.",
      "Pause 1-2 seconds at peak contraction to feel the back musculature lock."
    ],
    superman: [
      "Keep neck neutral with gaze down rather than hyperextending cervical spine.",
      "Squeeze glutes and lower back simultaneously as limbs rise off the floor.",
      "Do not hold breath; breathe smoothly and diaphragm-deep."
    ],
    ytw: [
      "Keep thumbs pointing toward ceiling throughout Y, T, and W positions.",
      "Depress shoulders away from ears; pinch mid-traps down and in.",
      "Hold 1-second peak squeeze on every single letter rep."
    ],
    plank: [
      "Position elbows squarely under shoulder joints.",
      "Form one unbroken horizontal line from heels through crown of head.",
      "Draw navel to spine and maintain stone-hard glute contraction."
    ],
    deadbug: [
      "Absolute rule: keep lower back flat against ground with zero daylight underneath.",
      "Control tempo: 2 seconds out, 1 second hold, 1 second return.",
      "Exhale deeply through the mouth as limb extends."
    ],
    climber: [
      "Prioritize crisp core compression over erratic rushing.",
      "Keep shoulders stacked directly over wrists without drifting backward.",
      "Eliminate torso rotation to preserve deep abdominal stiffness."
    ],
    hollow: [
      "Press lumbar spine firmly into floor so no hand could slide through.",
      "Tuck knees slightly or bring arms forward if lower back starts lifting.",
      "Elevate shoulder blades 2-3 cm off ground to maintain anterior core tension."
    ],
    catcow: [
      "Prioritize segmental articulation over speed.",
      "Inhale into chest opening and gentle lumbar arch; exhale curling into high thoracic dome."
    ],
    child: [
      "Reach fingertips as far as possible while sinking chest toward floor.",
      "Feel lats and shoulder girdle decompress with steady diaphragmatic breaths."
    ],
    door: [
      "Firmly grasp doorframe with feet set under edge, leaning back.",
      "Drive elbows straight back to pull chest forward, squeezing lats."
    ],
    benchtriceps: [
      "Keep elbows pinned narrow as forehead lowers toward edge.",
      "Isolate elbow extension to place direct load onto triceps."
    ],
    taps: [
      "Eliminate hip sway as hand taps opposite shoulder.",
      "Widen feet slightly if needed to establish stable tripod base."
    ],
    swimmer: [
      "Flutter opposite limbs rhythmically with straight knees, initiating power from glutes.",
      "Sustained tension across posterior chain strengthens upright posture."
    ]
  }
};

export function getProgramData(monthNum: number, weekNum: number, lang: Language) {
  const clampedMonth = Math.min(6, Math.max(1, monthNum));
  const clampedWeek = Math.min(4, Math.max(1, weekNum));
  const baseWeek = BASE_MONTH_TEMPLATE[clampedWeek] || BASE_MONTH_TEMPLATE[1];

  const phasesMap = YEARLY_PHASES_DATA[lang] || YEARLY_PHASES_DATA.tr;
  const monthMeta = phasesMap[clampedMonth] || phasesMap[1];
  const currentWeekMeta = monthMeta.weeks[clampedWeek] || { label: `${clampedWeek}. Week`, focus: "General focus" };

  const progressiveRepBonus = (clampedMonth - 1) * 1;
  const progressiveHoldBonus = (clampedMonth - 1) * 3;

  const dynamicDays: WorkoutDay[] = baseWeek.days.map(d => ({
    ...d,
    exercises: d.exercises.map(ex => {
      if (ex.type === 'timed') {
        const baseHold = ex.holdSeconds || 20;
        return { ...ex, holdSeconds: baseHold + progressiveHoldBonus };
      } else {
        const baseStr = String(ex.reps || "8");
        if (baseStr.includes('-')) {
          const parts = baseStr.split('-').map(p => parseInt(p.trim(), 10));
          return { ...ex, reps: `${parts[0] + progressiveRepBonus}-${parts[1] + progressiveRepBonus}` };
        } else if (!isNaN(parseInt(baseStr, 10))) {
          return { ...ex, reps: String(parseInt(baseStr, 10) + progressiveRepBonus) };
        }
        return { ...ex };
      }
    })
  }));

  const globalWeekIndex = ((clampedMonth - 1) * 4) + clampedWeek;
  const monthWord = lang === 'en' ? 'Month' : 'Ay';

  return {
    monthName: monthMeta.name,
    monthDesc: monthMeta.desc,
    weekTitle: `${clampedMonth}. ${monthWord} • ${currentWeekMeta.label} (${globalWeekIndex}/24)`,
    weekDesc: currentWeekMeta.focus,
    days: dynamicDays
  };
}

export function getScaledExerciseMetrics(ex: { type: 'rep' | 'timed'; holdSeconds?: number; reps?: string }, diff: WorkoutDifficulty) {
  if (ex.type === 'timed') {
    const baseHold = ex.holdSeconds || 20;
    let finalHold = baseHold;
    if (diff === 'easy') {
      finalHold = Math.max(12, baseHold - 5);
    } else if (diff === 'hard') {
      finalHold = baseHold + 8;
    }
    return { type: 'timed' as const, holdSeconds: finalHold, label: `${finalHold} sn` };
  } else {
    const baseStr = String(ex.reps || "8");
    if (baseStr.includes('-')) {
      const parts = baseStr.split('-').map(p => parseInt(p.trim(), 10));
      let low = parts[0];
      let high = parts[1];
      if (diff === 'easy') {
        low = Math.max(3, low - 2);
        high = Math.max(4, high - 2);
      } else if (diff === 'hard') {
        low = low + 3;
        high = high + 4;
      }
      return { type: 'rep' as const, reps: `${low}-${high}`, label: `${low}-${high}` };
    } else if (!isNaN(parseInt(baseStr, 10))) {
      let num = parseInt(baseStr, 10);
      if (diff === 'easy') {
        num = Math.max(3, num - 2);
      } else if (diff === 'hard') {
        num = num + 3;
      }
      return { type: 'rep' as const, reps: String(num), label: String(num) };
    }
    return { type: 'rep' as const, reps: baseStr, label: baseStr };
  }
}

export function getEstimatedDayDuration(baseDurationStr: string, diff: WorkoutDifficulty, lang: Language) {
  if (!baseDurationStr || baseDurationStr === "Dinlenme" || baseDurationStr === "Zafer") {
    if (baseDurationStr === "Zafer") return lang === 'en' ? "Victory" : "Zafer";
    return lang === 'en' ? "Rest" : "Dinlenme";
  }

  const matches = baseDurationStr.match(/\d+/g);
  if (!matches) return baseDurationStr;

  let min = parseInt(matches[0], 10);
  let max = matches[1] ? parseInt(matches[1], 10) : min + 5;

  if (diff === 'easy') {
    min = Math.max(12, min - 5);
    max = Math.max(16, max - 5);
  } else if (diff === 'medium') {
    min = min + 2;
    max = max + 3;
  } else if (diff === 'hard') {
    min = min + 5;
    max = max + 8;
  }
  return `${min}-${max} ${lang === 'en' ? 'min' : 'dk'}`;
}
