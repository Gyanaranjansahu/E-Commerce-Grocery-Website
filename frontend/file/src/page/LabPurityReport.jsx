import React from 'react';
import { 
  Printer, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  FileText, 
  Calendar, 
  Building2, 
  Beaker,
  Award
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

export default function LabPurityReport() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F4F3EE] py-8 sm:py-12 px-3 sm:px-6 font-sans antialiased text-[#1F241F]">
      
      {/* ACTION BAR (Hidden in print mode) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <a 
          href="/"
          className="text-xs font-semibold uppercase tracking-wider text-[#1B3821] hover:underline flex items-center gap-1.5"
        >
          ← Return to Storefront
        </a>

        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-white border border-[#DDD9CE] hover:bg-[#F2EFE8] text-xs font-semibold uppercase tracking-wider text-[#161B16] rounded-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* REPORT CERTIFICATE SHEET */}
      <div className="max-w-4xl mx-auto bg-white border border-[#D5D1C6] shadow-xl p-6 sm:p-12 relative overflow-hidden print:shadow-none print:border-none print:p-4">
        
        {/* WATERMARK STAMP */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none">
          <Award className="w-[450px] h-[450px] text-[#1B3821]" />
        </div>

        {/* 1. OFFICIAL LAB LETTERHEAD */}
        <header className="border-b-2 border-[#1B3821] pb-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-[#1B3821] text-white rounded-xs">
                  <ShieldCheck className="w-6 h-6" />
                </span>
                <div>
                  <h1 className="font-serif font-bold text-xl sm:text-2xl text-[#141814] tracking-tight uppercase">
                    Apex Food Analytics & Quality Lab
                  </h1>
                  <p className="text-[11px] font-mono text-[#5A635B] uppercase tracking-wider">
                    NABL Accredited Testing Laboratory (ISO/IEC 17025:2017) • FSSAI Recognized
                  </p>
                </div>
              </div>
            </div>

            {/* Accreditation Badge Box */}
            <div className="text-right sm:border-l sm:border-[#E5E1D8] sm:pl-6 text-xs font-mono">
              <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-900 font-bold tracking-widest uppercase border border-emerald-300 rounded-xs mb-1">
                NABL CERT: TC-8419
              </span>
              <p className="text-[10px] text-[#697269]">FSSAI Reg. No: 10018022007841</p>
              <p className="text-[10px] text-[#697269]">ULR: TC841926000049281F</p>
            </div>

          </div>

          <div className="mt-4 pt-3 border-t border-dashed border-[#E5E1D8] text-center">
            <h2 className="font-serif font-bold text-lg text-[#1B3821] uppercase tracking-widest">
              Certificate of Analysis & Purity Verification
            </h2>
            <p className="text-[11px] font-mono text-[#737C73]">
              Issued in accordance with Food Safety & Standards (Food Product Standards and Food Additives) Regulations
            </p>
          </div>
        </header>

        {/* 2. SAMPLE & TRACEABILITY METADATA */}
        <section className="bg-[#FAF9F5] border border-[#E8E4D9] p-4 sm:p-5 rounded-xs mb-6 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
            <div>
              <span className="text-[#879087] block text-[10px] uppercase">Sample Description</span>
              <strong className="text-[#141814] text-xs font-serif font-bold">A2 Gir Cow Farm Fresh Raw Milk</strong>
            </div>

            <div>
              <span className="text-[#879087] block text-[10px] uppercase">Batch / Lot Number</span>
              <strong className="text-[#141814]">LOT-08-RAIGAD-A2</strong>
            </div>

            <div>
              <span className="text-[#879087] block text-[10px] uppercase">Harvest & Milking Date</span>
              <strong className="text-[#141814]">14-Sep-2026 (04:15 AM IST)</strong>
            </div>

            <div>
              <span className="text-[#879087] block text-[10px] uppercase">Sampling Location</span>
              <strong className="text-[#141814]">Desi Gomata Sanctuary, Raigad</strong>
            </div>

            <div>
              <span className="text-[#879087] block text-[10px] uppercase">Date of Analysis</span>
              <strong className="text-[#141814]">14-Sep-2026 (06:00 AM IST)</strong>
            </div>

            <div>
              <span className="text-[#879087] block text-[10px] uppercase">Container & Condition</span>
              <strong className="text-[#141814]">Glass Bottle @ 3.8°C Cold-Sealed</strong>
            </div>
          </div>
        </section>

        {/* 3. SECTION 1: NUTRITIONAL & PHYSICAL COMPOSITION */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Beaker className="w-4 h-4 text-[#1B3821]" />
            <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-[#141814]">
              Table 1: Physical & Biochemical Composition
            </h3>
          </div>

          <div className="overflow-x-auto border border-[#E5E1D8]">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead className="bg-[#1B3821] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-2.5 border-r border-[#2C5234]">Test Parameter</th>
                  <th className="p-2.5 border-r border-[#2C5234] hidden sm:table-cell">Standard Protocol</th>
                  <th className="p-2.5 border-r border-[#2C5234]">Unit</th>
                  <th className="p-2.5 border-r border-[#2C5234]">FSSAI Standard</th>
                  <th className="p-2.5 border-r border-[#2C5234]">Observed Value</th>
                  <th className="p-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE7DE] bg-white">
                {PHYSICAL_PARAMETERS.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-[#FCFBF8]' : 'bg-white'}>
                    <td className="p-2.5 font-sans font-semibold text-[#161B16] border-r border-[#EBE7DE]">{row.parameter}</td>
                    <td className="p-2.5 text-[#6B726B] border-r border-[#EBE7DE] text-[11px] hidden sm:table-cell">{row.protocol}</td>
                    <td className="p-2.5 text-[#6B726B] border-r border-[#EBE7DE]">{row.unit}</td>
                    <td className="p-2.5 text-[#6B726B] border-r border-[#EBE7DE]">{row.specification}</td>
                    <td className="p-2.5 font-bold text-[#141814] border-r border-[#EBE7DE]">{row.result}</td>
                    <td className="p-2.5 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {row.remarks}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. SECTION 2: ADULTERATION SCREEN */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-[#1B3821]" />
            <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-[#141814]">
              Table 2: Zero Adulteration & Chemical Additive Panel
            </h3>
          </div>

          <div className="overflow-x-auto border border-[#E5E1D8]">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead className="bg-[#1B3821] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-2.5 border-r border-[#2C5234]">Adulterant Tested</th>
                  <th className="p-2.5 border-r border-[#2C5234] hidden sm:table-cell">Screening Protocol</th>
                  <th className="p-2.5 border-r border-[#2C5234]">Permissible Limit</th>
                  <th className="p-2.5 border-r border-[#2C5234]">Detection Level</th>
                  <th className="p-2.5 text-center">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE7DE] bg-white">
                {ADULTERATION_SCREENS.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-[#FCFBF8]' : 'bg-white'}>
                    <td className="p-2.5 font-sans font-semibold text-[#161B16] border-r border-[#EBE7DE]">{row.parameter}</td>
                    <td className="p-2.5 text-[#6B726B] border-r border-[#EBE7DE] text-[11px] hidden sm:table-cell">{row.protocol}</td>
                    <td className="p-2.5 text-[#6B726B] border-r border-[#EBE7DE]">{row.limit}</td>
                    <td className="p-2.5 font-bold text-emerald-900 border-r border-[#EBE7DE]">{row.result}</td>
                    <td className="p-2.5 text-center font-bold text-emerald-800">
                      <span className="px-2 py-0.5 bg-emerald-100/70 border border-emerald-300 rounded-xs text-[10px]">
                        PASSED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. SECTION 3: RESIDUE, HEAVY METALS & PATHOGEN MICROBIOLOGY */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-[#1B3821]" />
            <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-[#141814]">
              Table 3: Heavy Metals, Antibiotics & Microbiological Safety
            </h3>
          </div>

          <div className="overflow-x-auto border border-[#E5E1D8]">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead className="bg-[#1B3821] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-2.5 border-r border-[#2C5234]">Contaminant / Pathogen</th>
                  <th className="p-2.5 border-r border-[#2C5234] hidden sm:table-cell">Instrumentation</th>
                  <th className="p-2.5 border-r border-[#2C5234]">FSSAI Limit</th>
                  <th className="p-2.5 border-r border-[#2C5234]">Result Found</th>
                  <th className="p-2.5 text-center">Safety Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE7DE] bg-white">
                {CONTAMINANT_SCREENS.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-[#FCFBF8]' : 'bg-white'}>
                    <td className="p-2.5 font-sans font-semibold text-[#161B16] border-r border-[#EBE7DE]">{row.parameter}</td>
                    <td className="p-2.5 text-[#6B726B] border-r border-[#EBE7DE] text-[11px] hidden sm:table-cell">{row.protocol}</td>
                    <td className="p-2.5 text-[#6B726B] border-r border-[#EBE7DE]">{row.limit}</td>
                    <td className="p-2.5 font-bold text-[#141814] border-r border-[#EBE7DE]">{row.result}</td>
                    <td className="p-2.5 text-center font-bold text-emerald-800">
                      <span className="px-2 py-0.5 bg-emerald-100/70 border border-emerald-300 rounded-xs text-[10px]">
                        PASSED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 6. LAB OPINION & VERDICT */}
        <section className="bg-[#EEF2E8] border border-[#D1DDC5] p-4 rounded-xs mb-8">
          <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#141814] mb-1">
            Official Analyst Conclusion:
          </h4>
          <p className="text-xs text-[#2B452F] leading-relaxed">
            The sample marked <strong>LOT-08-RAIGAD-A2</strong> conforms strictly to FSSAI Standards for Raw Whole Cow Milk. The product shows natural high SNF & Butterfat ratios consistent with pure indigenous Bos Indicus (Gir cow) heritage. <strong>No chemical neutralizers, detergents, synthetic oils, urea, antibiotics, or extraneous water were detected.</strong>
          </p>
        </section>

        {/* 7. DIGITAL VALIDATION & SIGNATURE BLOCK */}
        <footer className="pt-4 border-t-2 border-[#1B3821] grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
          
          {/* QR Verification */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white border border-[#DDD9CE] shadow-2xs">
              <QrCode className="w-14 h-14 text-[#1B3821]" />
            </div>
            <div>
              <span className="text-[9px] font-mono text-[#7A837A] block uppercase leading-tight">
                Scan To Validate On National Registry
              </span>
              <span className="text-[10px] font-mono font-bold text-[#1B3821] block">
                AUTH-HASH: 981A-42FC
              </span>
            </div>
          </div>

          {/* Senior Analyst Signature */}
          <div className="text-center sm:text-left">
            <div className="h-10 flex items-end pb-1 font-serif italic text-base text-[#1B3821] border-b border-dashed border-[#AAA]">
              Dr. Archana Sen, Ph.D.
            </div>
            <span className="text-[10px] font-mono uppercase text-[#697269] block mt-1">
              Senior Dairy Biochemist / Analyst
            </span>
          </div>

          {/* Quality Director Seal */}
          <div className="text-center sm:text-right">
            <div className="h-10 flex items-end justify-center sm:justify-end pb-1 font-serif italic text-base text-[#1B3821] border-b border-dashed border-[#AAA]">
              K. V. Ramanathan
            </div>
            <span className="text-[10px] font-mono uppercase text-[#697269] block mt-1">
              Director of Quality Assurance (NABL Signatory)
            </span>
          </div>

        </footer>

        {/* Legal Disclaimer Footer */}
        <div className="mt-8 pt-3 border-t border-[#EBE7DE] text-[9px] font-mono text-[#8C948C] text-center">
          This test report relates only to the lot/sample received and verified by laboratory chain-of-custody. Reproduction of this Certificate of Analysis except in full is strictly prohibited without prior written consent from the testing laboratory.
        </div>

      </div>
    </div>
  );
}