export interface Device {
  measure: () => Promise<number>;
}