export interface Plant {
    id: number;
    name: string;
    lastWateredTime: string | null;
    wateringPercentage: number;
    status: WateringStatus;
}

export enum WateringStatus {
    Idle,
    Watering,
    Stopped
}