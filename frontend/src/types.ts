export interface RobotState {
  id: string;
  status: "idle" | "moving" | "serving";
  battery: number;
  position: { x: number; y: number };
}

export interface Greeting {
  id: number;
  message: string;
}