interface ContactValue {
  Phone_Number: string;
  Remark: string;
}

export interface ContactItem {
  name: string;
  value: ContactValue[];
}

export interface ContactRowProps {
  item: ContactValue;
  colorClass: string;
  isLast: boolean;
}

export interface ContactGroupCardProps {
  group: ContactItem;
  globalIndex: number;
}

export interface ContactProps {
  groups: ContactItem[];
  loading?: boolean;
}
