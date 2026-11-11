/* ==========================================================
   GAME BAHASA ARAB KELAS 3 (KEMENAG RI) - 5 HEWAN
   ========================================================== */

const questions = [
  {
    name: "Semut",
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&auto=format&fit=crop&q=80",
    demonstrative: "هٰذِهِ",
    animalWord: "نَمْلَةٌ"
  },
  {
    name: "Angsa",
    image: "https://images.unsplash.com/photo-1522850959516-58f957d76171?w=800&auto=format&fit=crop&q=80",
    demonstrative: "هٰذِهِ",
    animalWord: "إِوْزَّةٌ"
  },
  {
    name: "Nyamuk",
    image: "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=800&auto=format&fit=crop&q=80",
    demonstrative: "هٰذِهِ",
    animalWord: "بَعُوْضَةٌ"
  },
  {
    name: "Bebek",
    image: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=800&auto=format&fit=crop&q=80",
    demonstrative: "هٰذِهِ",
    animalWord: "بَطَّةٌ"
  },
  {
    name: "Kupu-kupu",
    image: "https://images.unsplash.com/photo-1551085254-e96b210df58a?w=800&auto=format&fit=crop&q=80",
    demonstrative: "هٰذِهِ",
    animalWord: "فَرَاشَةٌ"
  }
];

let currentIndex = 0;
let score = 0;
let playerName = "";
let userArrangedWords = [];
const TEACHER_PIN = "1234";

// Elemen DOM
const screenLogin = document.getElementById("screenLogin");
const screenGame = document.getElementById("screenGame");
const screenResult = document.getElementById("screenResult");
const screenTeacher = document.getElementById("screenTeacher");

const userBadge = document.getElementById("userBadge");
const scoreBadge = document.getElementById("scoreBadge");
const displayPlayerName = document.getElementById("displayPlayerName");
const displayScore = document.getElementById("displayScore");

const animalImage = document.getElementById("animalImage");
const btnPlaySound = document.getElementById("btnPlaySound");
const dropZone = document.getElementById("dropZone");
const wordBank = document.getElementById("wordBank");
const feedbackMsg = document.getElementById("feedbackMsg");
const progressFill = document.getElementById("progressFill");
const currentQNum = document.getElementById("currentQNum");
const totalQNum = document.getElementById("totalQNum");

// Audio Bahasa Arab
function playArabicAudio(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ar-SA";
  utterance.rate = 0.85;

  const voices = window.speechSynthesis.getVoices();
  const arabicVoice = voices.find(v => v.lang.startsWith("ar"));
  if (arabicVoice) utterance.voice = arabicVoice;

  window.speechSynthesis.speak(utterance);
}

function showScreen(screen) {
  [screenLogin, screenGame, screenResult, screenTeacher].forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}

// Mulai Game
document.getElementById("btnStartGame").addEventListener("click", () => {
  const input = document.getElementById("playerNameInput");
  if (!input.value.trim()) {
    alert("Masukkan namamu dulu ya!");
    return;
  }
  playerName = input.value.trim();
  displayPlayerName.textContent = playerName;
  score = 0;
  currentIndex = 0;
  displayScore.textContent = score;

  userBadge.style.display = "flex";
  scoreBadge.style.display = "flex";
  totalQNum.textContent = questions.length;

  showScreen(screenGame);
  loadQuestion();
});

// Tampilkan Soal
function loadQuestion() {
  const q = questions[currentIndex];
  currentQNum.textContent = currentIndex + 1;
  progressFill.style.width = `${(currentIndex / questions.length) * 100}%`;

  animalImage.src = q.image;
  dropZone.innerHTML = "";
  wordBank.innerHTML = "";
  feedbackMsg.textContent = "";
  userArrangedWords = [];

  const correctSentence = `${q.demonstrative} ${q.animalWord}`;
  setTimeout(() => playArabicAudio(correctSentence), 300);

  // Acak tombol kata
  const words = [q.demonstrative, q.animalWord].sort(() => Math.random() - 0.5);
  words.forEach(word => {
    const btn = document.createElement("button");
    btn.className = "word-chip";
    btn.textContent = word;
    btn.onclick = () => {
      userArrangedWords.push(word);
      btn.style.visibility = "hidden";

      const chip = document.createElement("button");
      chip.className = "word-chip in-dropzone";
      chip.textContent = word;
      chip.onclick = () => {
        userArrangedWords = userArrangedWords.filter(w => w !== word);
        chip.remove();
        btn.style.visibility = "visible";
      };
      dropZone.appendChild(chip);
    };
    wordBank.appendChild(btn);
  });
}

btnPlaySound.addEventListener("click", () => {
  const q = questions[currentIndex];
  playArabicAudio(`${q.demonstrative} ${q.animalWord}`);
});

document.getElementById("btnResetWords").addEventListener("click", () => {
  dropZone.innerHTML = "";
  userArrangedWords = [];
  wordBank.querySelectorAll(".word-chip").forEach(c => c.style.visibility = "visible");
});

// Cek Jawaban
document.getElementById("btnCheckAnswer").addEventListener("click", () => {
  const q = questions[currentIndex];
  const expected = `${q.demonstrative} ${q.animalWord}`;
  const actual = userArrangedWords.join(" ");

  if (userArrangedWords.length === 0) {
    feedbackMsg.textContent = "Susun dulu katanya ya!";
    feedbackMsg.className = "feedback-msg wrong";
    return;
  }

  if (actual === expected) {
    score += 20;
    displayScore.textContent = score;
    feedbackMsg.textContent = "Mumtaz! Jawaban Benar! 🎉";
    feedbackMsg.className = "feedback-msg correct";
    playArabicAudio("أَحْسَنْتَ");

    setTimeout(() => {
      currentIndex++;
      if (currentIndex < questions.length) {
        loadQuestion();
      } else {
        finishGame();
      }
    }, 1200);
  } else {
    feedbackMsg.textContent = "Kurang tepat, coba susun lagi ya! Semangat 💪";
    feedbackMsg.className = "feedback-msg wrong";
  }
});

// Halaman Akhir
function finishGame() {
  showScreen(screenResult);
  document.getElementById("finalName").textContent = `Petualang: ${playerName}`;
  document.getElementById("finalScore").textContent = score;

  let stars = "⭐⭐⭐⭐⭐";
  if (score <= 40) stars = "⭐⭐";
  else if (score <= 60) stars = "⭐⭐⭐";
  else if (score <= 80) stars = "⭐⭐⭐⭐";

  document.getElementById("starRating").textContent = stars;

  // Simpan data nilai ke LocalStorage
  const records = JSON.parse(localStorage.getItem("arabicGameRecords") || "[]");
  const now = new Date();
  const timeStr = `${now.toLocaleDateString('id-ID')} ${now.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}`;
  records.push({ nama: playerName, nilai: score, bintang: stars, waktu: timeStr });
  localStorage.setItem("arabicGameRecords", JSON.stringify(records));
}

document.getElementById("btnPlayAgain").addEventListener("click", () => {
  showScreen(screenLogin);
  document.getElementById("playerNameInput").value = "";
  userBadge.style.display = "none";
  scoreBadge.style.display = "none";
});

// Dashboard Guru (PIN: 1234)
const teacherPinInput = document.getElementById("teacherPinInput");
const pinBox = document.getElementById("pinBox");
const recapWrapper = document.getElementById("recapTableWrapper");

document.getElementById("btnOpenTeacher").addEventListener("click", () => {
  teacherPinInput.value = "";
  pinBox.style.display = "block";
  recapWrapper.style.display = "none";
  showScreen(screenTeacher);
});

document.getElementById("btnCloseTeacher").addEventListener("click", () => {
  showScreen(playerName ? screenGame : screenLogin);
});

document.getElementById("btnSubmitPin").addEventListener("click", () => {
  if (teacherPinInput.value === TEACHER_PIN) {
    pinBox.style.display = "none";
    recapWrapper.style.display = "block";
    renderTeacherTable();
  } else {
    alert("PIN Salah! Khusus pengajar.");
  }
});

function renderTeacherTable() {
  const tbody = document.getElementById("recapTableBody");
  tbody.innerHTML = "";
  const records = JSON.parse(localStorage.getItem("arabicGameRecords") || "[]");

  if (records.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px;">Belum ada data nilai murid.</td></tr>`;
    return;
  }

  records.forEach((r, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td><strong>${r.nama}</strong></td>
      <td><span style="color:#FF7B54; font-weight:bold;">${r.nilai}</span> / 100</td>
      <td>${r.bintang}</td>
      <td><small style="color:#6B7280;">${r.waktu}</small></td>
    `;
    tbody.appendChild(tr);
  });
}

// Download Excel (.CSV)
document.getElementById("btnDownloadExcel").addEventListener("click", () => {
  const records = JSON.parse(localStorage.getItem("arabicGameRecords") || "[]");
  if (records.length === 0) {
    alert("Belum ada data nilai untuk diunduh.");
    return;
  }

  let csvContent = "\uFEFFNo,Nama Siswa,Nilai,Bintang,Waktu Selesai\n";
  records.forEach((r, i) => {
    csvContent += `"${i + 1}","${r.nama}","${r.nilai}","${r.bintang}","${r.waktu}"\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Rekap_Nilai_Bahasa_Arab_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Reset Nilai
document.getElementById("btnClearData").addEventListener("click", () => {
  if (confirm("Apakah Bapak/Ibu yakin ingin menghapus seluruh rekapan nilai?")) {
    localStorage.removeItem("arabicGameRecords");
    renderTeacherTable();
  }
});
