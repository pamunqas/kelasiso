const knownFrameworks: Record<string, { name: string; banner: string; card: string; solid: string; bg: string; text: string; bgSolid: string; hoverBg: string; bgLight: string; borderColor: string }> = {
  'iso27001': { name: 'ISO 27001', banner: 'from-blue-600 to-indigo-700', card: 'from-blue-500 to-blue-700', solid: 'blue', bg: 'from-blue-50 to-blue-50', text: 'text-blue-600', bgSolid: 'bg-blue-600', hoverBg: 'hover:bg-blue-700', bgLight: 'bg-blue-50', borderColor: 'border-blue-400' },
  'iso9001': { name: 'ISO 9001', banner: 'from-green-600 to-teal-700', card: 'from-green-500 to-green-700', solid: 'green', bg: 'from-green-50 to-green-50', text: 'text-green-600', bgSolid: 'bg-green-600', hoverBg: 'hover:bg-green-700', bgLight: 'bg-green-50', borderColor: 'border-green-400' },
  'iso27002': { name: 'ISO 27002', banner: 'from-purple-600 to-violet-700', card: 'from-purple-500 to-purple-700', solid: 'purple', bg: 'from-purple-50 to-purple-50', text: 'text-purple-600', bgSolid: 'bg-purple-600', hoverBg: 'hover:bg-purple-700', bgLight: 'bg-purple-50', borderColor: 'border-purple-400' },
};

const colorPalette = [
  { name: 'Orange', banner: 'from-orange-600 to-amber-700', card: 'from-orange-500 to-orange-700', solid: 'orange', bg: 'from-orange-50 to-orange-50', text: 'text-orange-600', bgSolid: 'bg-orange-600', hoverBg: 'hover:bg-orange-700', bgLight: 'bg-orange-50', borderColor: 'border-orange-400' },
  { name: 'Pink', banner: 'from-pink-600 to-rose-700', card: 'from-pink-500 to-pink-700', solid: 'pink', bg: 'from-pink-50 to-pink-50', text: 'text-pink-600', bgSolid: 'bg-pink-600', hoverBg: 'hover:bg-pink-700', bgLight: 'bg-pink-50', borderColor: 'border-pink-400' },
  { name: 'Teal', banner: 'from-teal-600 to-cyan-700', card: 'from-teal-500 to-teal-700', solid: 'teal', bg: 'from-teal-50 to-teal-50', text: 'text-teal-600', bgSolid: 'bg-teal-600', hoverBg: 'hover:bg-teal-700', bgLight: 'bg-teal-50', borderColor: 'border-teal-400' },
  { name: 'Rose', banner: 'from-rose-600 to-red-700', card: 'from-rose-500 to-rose-700', solid: 'rose', bg: 'from-rose-50 to-rose-50', text: 'text-rose-600', bgSolid: 'bg-rose-600', hoverBg: 'hover:bg-rose-700', bgLight: 'bg-rose-50', borderColor: 'border-rose-400' },
  { name: 'Cyan', banner: 'from-cyan-600 to-sky-700', card: 'from-cyan-500 to-cyan-700', solid: 'cyan', bg: 'from-cyan-50 to-cyan-50', text: 'text-cyan-600', bgSolid: 'bg-cyan-600', hoverBg: 'hover:bg-cyan-700', bgLight: 'bg-cyan-50', borderColor: 'border-cyan-400' },
  { name: 'Amber', banner: 'from-amber-600 to-yellow-700', card: 'from-amber-500 to-amber-700', solid: 'amber', bg: 'from-amber-50 to-amber-50', text: 'text-amber-600', bgSolid: 'bg-amber-600', hoverBg: 'hover:bg-amber-700', bgLight: 'bg-amber-50', borderColor: 'border-amber-400' },
  { name: 'Emerald', banner: 'from-emerald-600 to-green-700', card: 'from-emerald-500 to-emerald-700', solid: 'emerald', bg: 'from-emerald-50 to-emerald-50', text: 'text-emerald-600', bgSolid: 'bg-emerald-600', hoverBg: 'hover:bg-emerald-700', bgLight: 'bg-emerald-50', borderColor: 'border-emerald-400' },
  { name: 'Fuchsia', banner: 'from-fuchsia-600 to-pink-700', card: 'from-fuchsia-500 to-fuchsia-700', solid: 'fuchsia', bg: 'from-fuchsia-50 to-fuchsia-50', text: 'text-fuchsia-600', bgSolid: 'bg-fuchsia-600', hoverBg: 'hover:bg-fuchsia-700', bgLight: 'bg-fuchsia-50', borderColor: 'border-fuchsia-400' },
  { name: 'Slate', banner: 'from-slate-600 to-slate-700', card: 'from-slate-500 to-slate-700', solid: 'slate', bg: 'from-slate-50 to-slate-50', text: 'text-slate-600', bgSolid: 'bg-slate-600', hoverBg: 'hover:bg-slate-700', bgLight: 'bg-slate-50', borderColor: 'border-slate-400' },
  { name: 'Red', banner: 'from-red-600 to-red-700', card: 'from-red-500 to-red-700', solid: 'red', bg: 'from-red-50 to-red-50', text: 'text-red-600', bgSolid: 'bg-red-600', hoverBg: 'hover:bg-red-700', bgLight: 'bg-red-50', borderColor: 'border-red-400' },
  { name: 'Yellow', banner: 'from-yellow-600 to-yellow-700', card: 'from-yellow-500 to-yellow-700', solid: 'yellow', bg: 'from-yellow-50 to-yellow-50', text: 'text-yellow-600', bgSolid: 'bg-yellow-600', hoverBg: 'hover:bg-yellow-700', bgLight: 'bg-yellow-50', borderColor: 'border-yellow-400' },
  { name: 'Lime', banner: 'from-lime-600 to-lime-700', card: 'from-lime-500 to-lime-700', solid: 'lime', bg: 'from-lime-50 to-lime-50', text: 'text-lime-600', bgSolid: 'bg-lime-600', hoverBg: 'hover:bg-lime-700', bgLight: 'bg-lime-50', borderColor: 'border-lime-400' },
  { name: 'Sky', banner: 'from-sky-600 to-sky-700', card: 'from-sky-500 to-sky-700', solid: 'sky', bg: 'from-sky-50 to-sky-50', text: 'text-sky-600', bgSolid: 'bg-sky-600', hoverBg: 'hover:bg-sky-700', bgLight: 'bg-sky-50', borderColor: 'border-sky-400' },
  { name: 'Violet', banner: 'from-violet-600 to-violet-700', card: 'from-violet-500 to-violet-700', solid: 'violet', bg: 'from-violet-50 to-violet-50', text: 'text-violet-600', bgSolid: 'bg-violet-600', hoverBg: 'hover:bg-violet-700', bgLight: 'bg-violet-50', borderColor: 'border-violet-400' },
  { name: 'Indigo', banner: 'from-indigo-600 to-indigo-700', card: 'from-indigo-500 to-indigo-700', solid: 'indigo', bg: 'from-indigo-50 to-indigo-50', text: 'text-indigo-600', bgSolid: 'bg-indigo-600', hoverBg: 'hover:bg-indigo-700', bgLight: 'bg-indigo-50', borderColor: 'border-indigo-400' },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const defaultColors = { 
  name: 'Gray', 
  description: 'Framework',
  banner: 'from-gray-600 to-gray-700', 
  card: 'from-gray-500 to-gray-700', 
  solid: 'gray', 
  bg: 'from-gray-50 to-gray-50',
  text: 'text-gray-600',
  bgSolid: 'bg-gray-600',
  hoverBg: 'hover:bg-gray-700',
  bgLight: 'bg-gray-50',
  borderColor: 'border-gray-400'
};

export function getFrameworkConfig(category: string) {
  if (!category) return defaultColors;
  
  const key = category.toLowerCase();
  
  if (knownFrameworks[key]) {
    return {
      name: knownFrameworks[key].name,
      description: `${knownFrameworks[key].name} Framework`,
      banner: knownFrameworks[key].banner,
      card: knownFrameworks[key].card,
      solid: knownFrameworks[key].solid,
      bg: knownFrameworks[key].bg,
      text: knownFrameworks[key].text,
      bgSolid: knownFrameworks[key].bgSolid,
      hoverBg: knownFrameworks[key].hoverBg,
      bgLight: knownFrameworks[key].bgLight,
      borderColor: knownFrameworks[key].borderColor,
    };
  }
  
  const colorIndex = hashString(key) % colorPalette.length;
  return {
    name: key.toUpperCase(),
    description: `${key.toUpperCase()} Framework`,
    banner: colorPalette[colorIndex].banner,
    card: colorPalette[colorIndex].card,
    solid: colorPalette[colorIndex].solid,
    bg: colorPalette[colorIndex].bg,
    text: colorPalette[colorIndex].text,
    bgSolid: colorPalette[colorIndex].bgSolid,
    hoverBg: colorPalette[colorIndex].hoverBg,
    bgLight: colorPalette[colorIndex].bgLight,
    borderColor: colorPalette[colorIndex].borderColor,
  };
}

export const frameworkConfig = {}; // Legacy support - returns empty, use getFrameworkConfig() instead