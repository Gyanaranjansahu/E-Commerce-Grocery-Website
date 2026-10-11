import React from 'react';
import {
  Printer, ShieldCheck, CheckCircle2, QrCode, Beaker, Building2, Award, ArrowLeft
} from 'lucide-react';

const PHYSICAL_PARAMETERS = [
  { parameter: 'Appearance & Color', protocol: 'Organoleptic', unit: '—', specification: 'Clean, homogeneous yellowish white', result: 'Complies', remarks: 'Pass' },
  { parameter: 'Taste & Odour', protocol: 'Organoleptic', unit: '—', specification: 'Characteristic fresh & pleasant', result: 'Complies', remarks: 'Pass' },
  { parameter: 'Milk Fat', protocol: 'IS 1224 (Part 1): Gerber', unit: '% m/m', specification: 'Min. 3.20%', result: '4.45%', remarks: 'Pass' },
  { parameter: 'Solids-Not-Fat (SNF)', protocol: 'IS 1479 (Part 2): Gravimetric', unit: '% m/m', specification: 'Min. 8.30%', result: '9.18%', remarks: 'Pass' },
  { parameter: 'Total Protein (Nx6.38)', protocol: 'AOAC 991.20 (Kjeldahl)', unit: '% m/m', specification: 'Min. 3.00%', result: '3.62%', remarks: 'Pass' },
  { parameter: 'Acidity (as Lactic Acid)', protocol: 'IS 1479 (Part 1)', unit: '% m/m', specification: '0.12 - 0.16%', result: '0.138%', remarks: 'Pass' },
  { parameter: 'Freezing Point Depression', protocol: 'ISO 5764: Cryoscopy', unit: '°C', specification: 'Max. -0.525°C', result: '-0.542°C', remarks: 'Pass (0.0% Added Water)' },
];

const ADULTERATION_SCREENS = [
  { parameter: 'Added Cane Sugar / Sucrose', protocol: 'FSSAI Dairy Manual 01.061', limit: 'Absent', result: 'Negative', status: 'Complies' },
  { parameter: 'Starch & Cereal Flours', protocol: 'Iodine Colorimetric (FSSAI 01.025)', limit: 'Absent', result: 'Negative', status: 'Complies' },
  { parameter: 'Urea & Nitrogen Extenders', protocol: 'DMAB Spectrophotometric', limit: 'Max. 700 mg/L', result: '185 mg/L (Natural baseline)', status: 'Complies' },
  { parameter: 'Detergents & Neutralizers', protocol: 'Methylene Blue / Rosolic Acid', limit: 'Absent', result: 'Negative', status: 'Complies' },
  { parameter: 'Formalin & Preservatives', protocol: 'Chromotropic Acid Assay', limit: 'Absent', result: 'Negative', status: 'Complies' },
  { parameter: 'Hydrogen Peroxide (H2O2)', protocol: 'Vanadium Pentoxide Protocol', limit: 'Absent', result: 'Negative', status: 'Complies' },
  { parameter: 'Synthetic Fat / Palm Oil Admixture', protocol: 'GC-FID Fatty Acid Profile', limit: 'Absent', result: 'Negative', status: 'Complies' },
];

const CONTAMINANT_SCREENS = [
  { parameter: 'Aflatoxin M1', protocol: 'HPLC-FLD / AOAC 2000.08', limit: 'Max. 0.50 µg/kg', result: '< 0.05 µg/kg', status: 'Pass' },
  { parameter: 'Lead (Pb)', protocol: 'ICP-MS (FSSAI Validated)', limit: 'Max. 0.02 mg/kg', result: '< 0.005 mg/kg', status: 'Pass' },
  { parameter: 'Veterinary Antibiotic Multi-Screen (β-lactams, Tetracyclines)', protocol: 'LC-MS/MS Multi-Residue', limit: 'Below MRL / LOD', result: 'Not Detected (ND)', status: 'Pass' },
  { parameter: 'Total Bacterial Plate Count (SPC)', protocol: 'IS 5402 / ISO 4833', limit: 'Max. 30,000 CFU/ml', result: '4,200 CFU/ml', status: 'Pass' },
  { parameter: 'E. Coli & Coliform Count', protocol: 'IS 5401 (Part 1)', limit: 'Absent in 0.1 ml', result: 'Absent', status: 'Pass' },
];

/* Every table is normalised to the same row shape so one component renders all three. */
const SECTIONS = [
  {
    title: 'Physical and biochemical composition',
    icon: Beaker,
    cols: ['Test parameter', 'Method', 'FSSAI standard', 'Observed', 'Status'],
    rows: PHYSICAL_PARAMETERS.map(r => ({
      name: r.parameter, method: r.protocol, limit: r.specification,
      result: r.result, unit: r.unit !== '—' ? r.unit : '', status: r.remarks
    }))
  },
  {
    title: 'Zero adulteration and chemical additive panel',
    icon: ShieldCheck,
    cols: ['Adulterant tested', 'Method', 'Permissible limit', 'Detection level', 'Outcome'],
    rows: ADULTERATION_SCREENS.map(r => ({
      name: r.parameter, method: r.protocol, limit: r.limit, result: r.result, unit: '', status: 'Passed'
    }))
  },
  {
    title: 'Heavy metals, antibiotics and microbiological safety',
    icon: Building2,
    cols: ['Contaminant or pathogen', 'Instrument', 'FSSAI limit', 'Result found', 'Safety status'],
    rows: CONTAMINANT_SCREENS.map(r => ({
      name: r.parameter, method: r.protocol, limit: r.limit, result: r.result, unit: '', status: 'Passed'
    }))
  }
];

const META = [
  ['Sample description', 'A2 Gir Cow Farm Fresh Raw Milk'],
  ['Batch / lot number', 'LOT-08-RAIGAD-A2'],
  ['Milking date', '14-Sep-2026, 04:15 AM IST'],
  ['Sampling location', 'Desi Gomata Sanctuary, Raigad'],
  ['Date of analysis', '14-Sep-2026, 06:00 AM IST'],
  ['Container and condition', 'Glass bottle, cold-sealed at 3.8°C']
];

const TOTAL_TESTS = SECTIONS.reduce((n, s) => n + s.rows.length, 0);

function Pill({ children }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#17402A] bg-[#E6EFE4] ring-1 ring-[#17402A]/15 px-2.5 py-1 rounded-full whitespace-nowrap">
      <CheckCircle2 className="w-3.5 h-3.5 text-[#3E7D52]" />
      {children}
    </span>
  );
}

function ResultTable({ section, index }) {
  const Icon = section.icon;
  return (
    <section className="mb-10 break-inside-avoid">
      <div className="flex items-center gap-3 mb-4">
        <span className="shrink-0 w-9 h-9 rounded-full bg-[#17402A] text-[#E9D8A6] flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </span>
        <h3 className="display text-lg sm:text-xl font-medium">
          <span className="text-[#A9812A] mr-1.5">Table {index + 1}.</span>{section.title}
        </h3>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-xl ring-1 ring-[#17402A]/15 overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="bg-[#17402A] text-[#E7EFE8]">
              {section.cols.map((c, i) => (
                <th key={c} className={`px-4 py-3 font-semibold ${i === 4 ? 'text-right' : ''}`}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.rows.map((r, i) => (
              <tr key={r.name} className={`${i % 2 ? 'bg-[#F7F9F4]' : 'bg-white'} border-t border-[#17402A]/10 align-top`}>
                <td className="px-4 py-3.5 font-semibold text-[#112018] max-w-[15rem]">{r.name}</td>
                <td className="px-4 py-3.5 text-[#5E6D62] max-w-[13rem]">{r.method}</td>
                <td className="px-4 py-3.5 text-[#34443A] tabular-nums">{r.limit}</td>
                <td className="px-4 py-3.5 font-semibold text-[#112018] tabular-nums">
                  {r.result}{r.unit && <span className="ml-1 text-xs font-normal text-[#7C8B80]">{r.unit}</span>}
                </td>
                <td className="px-4 py-3.5 text-right"><Pill>{r.status}</Pill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="md:hidden rounded-xl ring-1 ring-[#17402A]/15 divide-y divide-[#17402A]/10 overflow-hidden bg-white">
        {section.rows.map(r => (
          <li key={r.name} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <h4 className="font-semibold text-[15px] leading-snug">{r.name}</h4>
              <Pill>{r.status}</Pill>
            </div>
            <p className="text-xs text-[#7C8B80] mt-1">{r.method}</p>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-[#7C8B80]">{section.cols[2]}</dt>
                <dd className="text-[#34443A] tabular-nums">{r.limit}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#7C8B80]">{section.cols[3]}</dt>
                <dd className="font-semibold tabular-nums">{r.result} {r.unit}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function LabPurityReport() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="lab min-h-screen bg-[#E9EDE5] py-6 sm:py-12 px-3 sm:px-6 text-[#112018] antialiased selection:bg-[#17402A] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Hanken+Grotesk:wght@400;500;600;700&family=Mrs+Saint+Delafield&display=swap');
        .lab { font-family: 'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif; }
        .lab .display { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; letter-spacing: -0.015em; }
        .lab .script { font-family: 'Mrs Saint Delafield', cursive; }
        .lab a:focus-visible, .lab button:focus-visible { outline: 2px solid #A9812A; outline-offset: 3px; }
        .lab .guilloche {
          background-image:
            repeating-radial-gradient(circle at 0 0, transparent 0 7px, rgba(23,64,42,.07) 7px 8px),
            repeating-radial-gradient(circle at 100% 0, transparent 0 7px, rgba(169,129,42,.09) 7px 8px);
        }
        @media print {
          @page { size: A4; margin: 10mm; }
          .lab { background: #fff !important; padding: 0 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .lab .sheet { box-shadow: none !important; }
          .lab .md\\:block { display: block !important; }
          .lab ul.md\\:hidden { display: none !important; }
        }
      `}</style>

      {/* Action bar (hidden when printing) */}
      <div className="max-w-5xl mx-auto mb-5 flex items-center justify-between gap-3 print:hidden">
        <a href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#17402A] hover:underline underline-offset-4">
          <ArrowLeft className="w-4 h-4" />
          Back to store
        </a>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#17402A] hover:bg-[#0F2D1D] text-white text-sm font-semibold transition-colors cursor-pointer shadow-[0_12px_28px_-12px_rgba(23,64,42,0.8)]"
        >
          <Printer className="w-4 h-4" />
          Print or save PDF
        </button>
      </div>

      {/* Certificate: double-rule frame */}
      <div className="sheet max-w-5xl mx-auto bg-white p-1.5 sm:p-2.5 shadow-[0_40px_90px_-40px_rgba(17,32,24,0.55)]">
        <div className="relative border-2 border-[#17402A] p-1">
          <div className="relative border border-[#A9812A]/60 overflow-hidden px-5 py-8 sm:px-12 sm:py-12">

            {/* Guilloche corners + watermark */}
            <div className="guilloche pointer-events-none absolute -top-px -left-px w-40 h-40 opacity-80 [mask-image:radial-gradient(circle_at_0_0,#000,transparent_70%)]" />
            <div className="guilloche pointer-events-none absolute -bottom-px -right-px w-40 h-40 opacity-80 [mask-image:radial-gradient(circle_at_100%_100%,#000,transparent_70%)]" />
            <Award aria-hidden className="pointer-events-none absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] sm:w-[520px] sm:h-[520px] text-[#17402A] opacity-[0.035]" strokeWidth={0.6} />

            <div className="relative">
              {/* Letterhead */}
              <header>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <span className="shrink-0 w-14 h-14 rounded-full bg-[#17402A] text-[#E9D8A6] ring-4 ring-[#17402A]/10 flex items-center justify-center">
                      <ShieldCheck className="w-7 h-7" />
                    </span>
                    <div>
                      <h1 className="display text-2xl sm:text-3xl font-medium leading-tight">Apex Food Analytics &amp; Quality Lab</h1>
                      <p className="text-sm text-[#5E6D62] mt-1 max-w-md">
                        NABL accredited testing laboratory (ISO/IEC 17025:2017). FSSAI recognised.
                      </p>
                    </div>
                  </div>

                  <dl className="text-sm md:text-right space-y-1.5 md:pl-6 md:border-l border-[#17402A]/15 shrink-0">
                    <div>
                      <dt className="sr-only">NABL certificate</dt>
                      <dd className="inline-block px-3 py-1 rounded-full bg-[#F4EBD0] text-[#6F5214] font-semibold ring-1 ring-[#A9812A]/40">NABL cert: TC-8419</dd>
                    </div>
                    <div className="text-[#5E6D62]"><dt className="inline">FSSAI reg. no. </dt><dd className="inline font-medium text-[#112018] tabular-nums">10018022007841</dd></div>
                    <div className="text-[#5E6D62]"><dt className="inline">ULR </dt><dd className="inline font-medium text-[#112018] tabular-nums">TC841926000049281F</dd></div>
                  </dl>
                </div>

                {/* Title with ornamental rule */}
                <div className="mt-10 text-center">
                  <div className="flex items-center gap-4 justify-center text-[#A9812A]">
                    <span className="h-px flex-1 max-w-[9rem] bg-gradient-to-r from-transparent to-[#A9812A]/70" />
                    <Award className="w-5 h-5" />
                    <span className="h-px flex-1 max-w-[9rem] bg-gradient-to-l from-transparent to-[#A9812A]/70" />
                  </div>
                  <h2 className="display text-3xl sm:text-5xl font-medium mt-4 leading-[1.08]">
                    Certificate of Analysis and Purity Verification
                  </h2>
                  <p className="text-sm text-[#5E6D62] mt-3 max-w-2xl mx-auto leading-relaxed">
                    Issued in accordance with the Food Safety and Standards (Food Product Standards and Food Additives) Regulations.
                  </p>
                </div>
              </header>

              {/* Verdict banner */}
              <div className="mt-10 rounded-2xl bg-[#17402A] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8 print:break-inside-avoid">
                <div className="flex items-center gap-4">
                  <span className="shrink-0 w-12 h-12 rounded-full bg-[#E9D8A6] text-[#17402A] flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </span>
                  <div>
                    <p className="text-sm text-[#BFE3C7]">Overall result</p>
                    <p className="display text-2xl font-medium">Conforms to FSSAI standards</p>
                  </div>
                </div>
                <dl className="sm:ml-auto grid grid-cols-3 gap-6 sm:gap-10 text-left">
                  {[[TOTAL_TESTS, 'Tests run'], [TOTAL_TESTS, 'Passed'], [0, 'Failed']].map(([n, l]) => (
                    <div key={l}>
                      <dd className="display text-3xl font-medium tabular-nums">{n}</dd>
                      <dt className="text-xs text-[#BFE3C7]">{l}</dt>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Sample details */}
              <section className="mt-8 mb-10 print:break-inside-avoid">
                <h3 className="display text-lg font-medium mb-3">Sample and traceability details</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-[#17402A]/15">
                  {META.map(([k, v]) => (
                    <div key={k} className="py-3.5 pr-4 border-b border-[#17402A]/10">
                      <dt className="text-xs text-[#7C8B80]">{k}</dt>
                      <dd className="font-semibold mt-0.5">{v}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              {SECTIONS.map((s, i) => <ResultTable key={s.title} section={s} index={i} />)}

              {/* Analyst conclusion */}
              <section className="mb-12 pl-5 border-l-4 border-[#A9812A] print:break-inside-avoid">
                <h4 className="display text-lg font-medium">Analyst's conclusion</h4>
                <p className="mt-2 text-[15px] text-[#34443A] leading-relaxed max-w-3xl">
                  The sample marked <strong className="text-[#112018]">LOT-08-RAIGAD-A2</strong> conforms strictly to FSSAI standards for raw whole cow milk. It shows high natural SNF and butterfat ratios consistent with pure indigenous Bos indicus (Gir cow) heritage.{' '}
                  <strong className="text-[#112018]">No chemical neutralisers, detergents, synthetic oils, urea, antibiotics or extraneous water were detected.</strong>
                </p>
              </section>

              {/* Validation and signatures */}
              <footer className="pt-8 border-t-2 border-[#17402A] grid grid-cols-1 md:grid-cols-12 gap-8 items-end print:break-inside-avoid">
                <div className="md:col-span-4 flex items-center gap-4">
                  <div className="p-2.5 bg-white rounded-lg ring-1 ring-[#17402A]/20">
                    <QrCode className="w-16 h-16 text-[#17402A]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm text-[#5E6D62] leading-snug">Scan to validate on the national registry</p>
                    <p className="text-sm font-semibold text-[#17402A] mt-1 tabular-nums">Auth hash: 981A-42FC</p>
                  </div>
                </div>

                <div className="md:col-span-3">
                  <p className="script text-4xl text-[#17402A] leading-none pb-1 border-b border-[#17402A]/30">Dr. Archana Sen</p>
                  <p className="text-sm font-semibold mt-2">Dr. Archana Sen, Ph.D.</p>
                  <p className="text-xs text-[#7C8B80]">Senior dairy biochemist and analyst</p>
                </div>

                <div className="md:col-span-3">
                  <p className="script text-4xl text-[#17402A] leading-none pb-1 border-b border-[#17402A]/30">K. V. Ramanathan</p>
                  <p className="text-sm font-semibold mt-2">K. V. Ramanathan</p>
                  <p className="text-xs text-[#7C8B80]">Director of quality assurance (NABL signatory)</p>
                </div>

                {/* Seal */}
                <div className="md:col-span-2 flex md:justify-end">
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#E9D8A6] via-[#C9A24A] to-[#A9812A] p-1.5 shadow-[0_10px_24px_-10px_rgba(111,82,20,0.8)]">
                    <div className="w-full h-full rounded-full border border-dashed border-[#17402A]/60 flex flex-col items-center justify-center text-[#17402A] text-center">
                      <Award className="w-7 h-7" />
                      <span className="text-[10px] font-bold leading-tight mt-0.5">NABL<br />TC-8419</span>
                    </div>
                  </div>
                </div>
              </footer>

              <p className="mt-10 pt-4 border-t border-[#17402A]/10 text-xs text-[#7C8B80] text-center leading-relaxed max-w-3xl mx-auto">
                This test report relates only to the lot or sample received and verified by laboratory chain of custody. Reproduction of this certificate except in full is prohibited without prior written consent from the testing laboratory.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}