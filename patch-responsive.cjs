const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/app/screens/mission');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Fix root container
  const rootRegex = /className="flex flex-col h-full font-\['Nunito'\] justify-between overflow-hidden max-h-full min-h-0 relative p-1 sm:p-2 select-none"/g;
  if (rootRegex.test(content)) {
    content = content.replace(
      rootRegex,
      `className="flex flex-col h-full font-['Nunito'] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-2 sm:p-4 md:p-6 select-none relative"`
    );
    changed = true;
  }
  
  // Alternative root container seen in some files
  const rootRegex2 = /className="flex flex-col h-full font-\['Nunito'\] justify-between overflow-y-auto max-h-full min-h-0 relative p-1 sm:p-2 select-none"/g;
  if (rootRegex2.test(content)) {
    content = content.replace(
      rootRegex2,
      `className="flex flex-col h-full font-['Nunito'] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-2 sm:p-4 md:p-6 select-none relative"`
    );
    changed = true;
  }

  // 2. Fix grid container squishing
  const gridRegex = /className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-5 flex-1 min-h-0 h-full items-stretch"/g;
  if (gridRegex.test(content)) {
    content = content.replace(
      gridRegex,
      `className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 flex-1 mt-2 md:mt-4"`
    );
    changed = true;
  }
  
  // Other grid regex pattern
  const gridRegex2 = /className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-5 flex-1 min-h-0 items-center my-auto"/g;
  if (gridRegex2.test(content)) {
    content = content.replace(
      gridRegex2,
      `className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 flex-1 mt-2 md:mt-4"`
    );
    changed = true;
  }

  // 3. Remove nested justify-between that causes squishing
  const colRegex = /className="md:col-span-8 lg:col-span-9 flex flex-col justify-between h-full min-h-0 overflow-y-auto/g;
  if (colRegex.test(content)) {
    content = content.replace(
      colRegex,
      `className="md:col-span-8 lg:col-span-9 flex flex-col space-y-4 md:space-y-6 h-full min-h-0 overflow-y-auto`
    );
    changed = true;
  }
  
  // Right col general
  const rightColRegex = /className="md:col-span-7 flex flex-col justify-between h-full space-y-3"/g;
  if (rightColRegex.test(content)) {
    content = content.replace(
      rightColRegex,
      `className="md:col-span-7 flex flex-col space-y-4 md:space-y-6"`
    );
    changed = true;
  }
  
  // Left col general
  const leftColRegex = /className="md:col-span-5 relative flex flex-col justify-center items-center h-full min-h-\[220px\] sm:min-h-\[270px\]"/g;
  if (leftColRegex.test(content)) {
    content = content.replace(
      leftColRegex,
      `className="md:col-span-5 relative flex flex-col justify-center items-center"`
    );
    changed = true;
  }
  
  // Polaroid sizing fix
  const polaroidRegex = /w-full max-w-\[250px\] sm:max-w-\[280px\] bg-\[#fdfbf7\]/g;
  if (polaroidRegex.test(content)) {
    content = content.replace(
      polaroidRegex,
      `w-full max-w-[180px] xs:max-w-[200px] sm:max-w-[240px] md:max-w-[280px] bg-[#fdfbf7]`
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Patched ${file}`);
  }
}
