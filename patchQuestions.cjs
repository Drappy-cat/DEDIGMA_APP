const fs = require('fs');
const path = require('path');

function generateExplanation(soal, jawaban_teks) {
  const lowerSoal = soal.toLowerCase();
  
  let reasoning = "Ini adalah langkah yang tepat dalam mempelajari dan melestarikan warisan budaya Magetan.";
  
  if (lowerSoal.includes("sumber") || lowerSoal.includes("dipercaya") || lowerSoal.includes("resmi") || lowerSoal.includes("terpercaya")) {
    reasoning = "Memastikan informasi dari sumber resmi sangat penting dalam literasi digital agar kita tidak terjebak berita bohong (hoaks).";
  } else if (lowerSoal.includes("membandingkan") || lowerSoal.includes("mengevaluasi") || lowerSoal.includes("berbeda")) {
    reasoning = "Membandingkan dan mengevaluasi dari beberapa sumber adalah kunci utama berpikir kritis dalam literasi digital.";
  } else if (lowerSoal.includes("larung sesaji")) {
    reasoning = "Larung Sesaji di Telaga Sarangan adalah bentuk kearifan lokal sebagai ungkapan syukur masyarakat kepada Tuhan atas berkah alam.";
  } else if (lowerSoal.includes("bersih desa")) {
    reasoning = "Tradisi Bersih Desa tidak hanya bermakna syukur, tetapi juga mempererat gotong royong dan kerukunan antarwarga desa.";
  } else if (lowerSoal.includes("ledug suro") || lowerSoal.includes("suro")) {
    reasoning = "Ledug Suro (Lesung Bedug Suro) merupakan tradisi menyambut Tahun Baru Islam dan Jawa yang memperkuat kebersamaan masyarakat.";
  } else if (lowerSoal.includes("membagikan") || lowerSoal.includes("bertanggung jawab") || lowerSoal.includes("sosial media")) {
    reasoning = "Kita harus selalu memverifikasi kebenaran sebuah informasi sebelum membagikannya ke orang lain agar tidak menyebarkan informasi palsu.";
  } else if (lowerSoal.includes("fakta")) {
    reasoning = "Fakta adalah hal yang benar-benar terjadi dan dapat dibuktikan kebenarannya dengan data atau sumber yang sah.";
  } else if (lowerSoal.includes("mengakses") || lowerSoal.includes("membuka media") || lowerSoal.includes("tablet")) {
    reasoning = "Mengakses informasi melalui perangkat digital dengan baik merupakan keterampilan dasar dari literasi digital di era modern.";
  } else if (lowerSoal.includes("budaya") || lowerSoal.includes("melestarikan")) {
    reasoning = "Menjaga warisan leluhur adalah tugas kita bersama agar identitas dan kearifan lokal daerah tidak punah ditelan zaman.";
  }

  return `Jawaban yang tepat adalah: "${jawaban_teks}". ${reasoning}`;
}

function processFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Parse the current array structure
  // Using a regex to match the object blocks and inject the pembahasan
  const objectsRegex = /{(\s*"id":\s*\d+,[\s\S]*?"jawaban":\s*\d+)\s*}/g;
  
  let newContent = fileContent.replace(objectsRegex, (match, p1) => {
    // We need to carefully extract the soal and jawaban text to generate the explanation
    const idMatch = p1.match(/"id":\s*(\d+)/);
    const soalMatch = p1.match(/"soal":\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
    const opsiMatches = [...p1.matchAll(/"([^"\\]*(?:\\.[^"\\]*)*)"/g)];
    // Extract answer index
    const jawabanMatch = p1.match(/"jawaban":\s*(\d+)/);
    
    if (idMatch && soalMatch && jawabanMatch) {
      const soal = soalMatch[1];
      const jawabanIdx = parseInt(jawabanMatch[1], 10);
      
      // Opsi are the strings after "opsi": [
      const opsiBlockMatch = p1.match(/"opsi":\s*\[([\s\S]*?)\]/);
      if (opsiBlockMatch) {
        const opsiStrs = [...opsiBlockMatch[1].matchAll(/"([^"\\]*(?:\\.[^"\\]*)*)"/g)];
        const jawaban_teks = opsiStrs[jawabanIdx] ? opsiStrs[jawabanIdx][1] : "";
        
        const pembahasan = generateExplanation(soal, jawaban_teks);
        
        // Escape quotes for the JSON-like TS structure
        const escapedPembahasan = pembahasan.replace(/"/g, '\\"');
        return `{${p1},\n    "pembahasan": "${escapedPembahasan}"\n  }`;
      }
    }
    return match; // fallback
  });
  
  // Inject the type definition update if needed
  if (!newContent.includes('"pembahasan"')) {
    console.error("Failed to inject pembahasan in", filePath);
  } else {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log("Successfully updated", filePath);
  }
}

processFile('./src/app/data/pretestQuestions.ts');
processFile('./src/app/data/posttestQuestions.ts');
