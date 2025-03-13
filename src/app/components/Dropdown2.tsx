import React from 'react';
import { MultiSelect } from '@mantine/core';

const atc2: string[] = [
  'J01 Antibacterials for systemic use',
  'S02 Otologicals',
  'D08 Antiseptics and disinfectants',
  'H03 Thyroid therapy',
  'A07 Antidiarrheals, intestinal antiinflammatory/antiinfective agents',
  'D06 Antibiotics and chemotherapeutics for dermatological use',
  'P02 Anthelmintics',
  'A06 Drugs for constipation',
  'W01 General Herbal',
  'V06 General nutrients',
  'N04 Anti-parkinson drugs',
  'M01 Antiinflammatory and antirheumatic products',
  'D10 Anti-acne preparations',
  'C10 Lipid modifying agents',
  'R02 Throat preparations',
  'L04 Immunosuppressants',
  'A09 Digestives incl. enzymes',
  'A03 Drugs for functional gastrointestinal disorders',
  'C02 Antihypertensives',
  'B02 Antihemorrhagics',
  'R03 Drugs for obstructive airway diseases',
  'G02 Other gynaecologicals',
  'C03 Diuretics',
  'A08 Antiobesity preparations, excluding diet products',
  'G03 Sex hormones and modulators of the genital system',
  'L02 Endocrine therapy',
  'P03 Ectoparasiticides incl. scabicides, insecticides and repellents',
  'B03 Antianemic preparations',
  'J02 Antimytotics for systemic use',
  'N06 Psychoanaleptics',
  'A14 Anabolic agents for systemic use',
  'S01 Ophthalmologicals',
  'A11 Vitamins',
  'N01 Anesthetics',
  'C04 Peripheral Vasodilators',
  'S03 Ophthalmological and Otological Preparations',
  'D05 Antipsoriatics',
  'D07 Corticosteroids, dermatological preparations',
  'M03 Muscle relaxants',
  'B01 Antithrombotic agents',
  'M05 Drugs for treatment of bone diseases',
  'D03 Preparations for treatment of wounds and ulcer',
  'L01 Antineoplastic agents',
  'L03 Immunostimulants',
  'N07 Other nervous system drugs',
  'D01 Antifungals for dermatological use',
  'C05 Vasoprotectives',
  'R05 Cough and cold preparations',
  'D11 Other dermatologicals',
  'N05 Psycholeptics',
  'N02 Analgesics',
  'H02 Corticosteroids for systemic use',
  'D04 Antipruritics, incl. antihistamines, anesthetics, etc.',
  'M09 Other drugs for disorders of the musculo-skeletal system',
  'H01 Pituitary and hypothalamic hormones and analogues',
  'G04 Urologicals',
  'A02 Drugs for acid related disorders',
  'A04 Antiemetics and Antinauseants',
  'J05 Antivirals for systemic use',
  'A10 Drugs used in diabetes',
  'M04 Antigout preparations',
  'R06 Antihistamines for systemic use',
  'N03 Antiepileptics',
  'C01 Cardiac therapy',
  'A05 Bile and Liver Therapy',
  'B05 Blood substitutes and perfusion solutions',
  'V03 All other therapeutic products',
  'V01 Allergens',
  'C09 Agents acting on the renin-angiotensin system',
  'D02 Emollients and Protectives',
  'M02 Topical for Joint, Muscular pain',
  'A12 Mineral supplements',
  'P01 Antiprotozoals',
  'C07 Beta blocking agents',
  'J04 Antimycobacterials',
  'G01 Gynaecological antiinfectives and antiseptics',
  'R01 Nasal preparations',
  'A16 Other Alimentary Tract and Metabolism Products',
  'C08 Calcium channel blockers',
  '*'
];

interface Dropdown2Props {
  selectedOptions: string[];
  setSelectedOptions: (options: string[]) => void;
}

const Dropdown2: React.FC<Dropdown2Props> = ({ selectedOptions, setSelectedOptions }) => {
  return (
    <MultiSelect
      label="Select a field"
      placeholder="Pick ATC2 levels to be subscribed to"
      data={atc2}
      value={selectedOptions}
      onChange={setSelectedOptions}
      searchable
    />
  );
};

export default Dropdown2;
