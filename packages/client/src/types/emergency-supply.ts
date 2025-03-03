export interface EmergencySupply {
  _id: string;
  name: string;
  specification: string;
  location: string;
  configuredQuantity: number;
  currentQuantity: number;
  inspectionStatus: string;
  remarks?: string;
} 