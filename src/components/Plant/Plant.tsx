import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Plant as PlantInterface, WateringStatus } from '../../features/plant/plantTypes';
import { RiPlantLine } from 'react-icons/ri';
import styles from './Plant.module.css';
import moment from 'moment';
import { useAppDispatch } from '../../app/hooks';
import { editPlantAsync } from '../../features/plant/plantSlice';

const clamp = (num: number, min: number, max: number) => {
    return num <= min ? min : num >= max ? max : num;
}
export const DotNetDateFormat = "YYYY-MM-DD[T]HH:mm:ss";

interface PlantProps {
    plant: PlantInterface;
}

const Plant: React.FC<PlantProps> = ({
    plant,
}) => {
    const [updatedWateringStatus, setUpdatedWateringStatus] = useState<WateringStatus>(plant.status);
    const [updatedWateringPercentage, setUpdatedWateringPercentage] = useState(plant.wateringPercentage);
    const [isWatering, setIsWatering] = useState(false);
    const dispatch = useAppDispatch();
    const wateringRef = useRef<any>();
    const [currentTime, setCurrentTime] = useState(moment());
    const [cooldown, setCooldown] = useState(false);

    useEffect(() => {
        const timerInterval = setInterval(() => {
            setCurrentTime(moment());
        }, 1000);
        return () => {
            clearInterval(timerInterval);
        };
    }, [])

    useEffect(() => {
        setUpdatedWateringStatus(plant.status);
        setUpdatedWateringPercentage(plant.wateringPercentage);
    }, [plant])



    const startWatering = async () => {
        if (isWatering){
            alert("Already watering");
            return;
        }
        if (cooldown){
            alert("Must wait 30 seconds");
            return;
        }
        try {
            await dispatch(editPlantAsync({...plant, status: WateringStatus.Watering}));
            // setUpdatedWateringStatus(WateringStatus.Watering);
            wateringRef.current = setInterval(() => {
                setUpdatedWateringPercentage(curr => curr + 10);
            }, 1000);
            setIsWatering(true);
        }catch (err) {
            alert("Failed to start watering.");
        }
    }

    // gets called whenever the user clicks the stop button or automatically after the watering percentage reaches 100%(after 10s)
    const wateringStopped = useCallback(async () => {
        try {
            const lastWateredTime = moment().format(DotNetDateFormat);
            await dispatch(
                    editPlantAsync({
                        ...plant, 
                        status: WateringStatus.Stopped, 
                        wateringPercentage: updatedWateringPercentage, 
                        lastWateredTime,
                    })
                );
            // setUpdatedWateringStatus(WateringStatus.Stopped);
            clearInterval(wateringRef.current);
            setIsWatering(false);
            setCooldown(true);
            const cooldownInterval = setInterval(() => {
                setUpdatedWateringPercentage(curr => Math.max(curr - 3, 0));
            }, 1000)
            
            setTimeout(() => {
                // setUpdatedWateringStatus(WateringStatus.Idle);
                setCooldown(false);
                clearInterval(cooldownInterval);
            }, 30000);
        }catch (err) {
            alert("Failed to stop watering.");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, updatedWateringPercentage]);

    const stopWatering = () => {
        if (!isWatering){
            alert("Currently not watering");
            return;
        }

        wateringStopped();
        
    }

    useEffect(() => {
        if (updatedWateringPercentage >= 100){
            wateringStopped();
        }
    }, [updatedWateringPercentage, wateringStopped]);

    useEffect(() => {
        // when cooldown changes back to false(or initial render) set the plant back to idle
        if (!cooldown){
            dispatch(
                editPlantAsync({
                    ...plant, 
                    status: WateringStatus.Idle, 
                    wateringPercentage: updatedWateringPercentage 
                })
            );
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, cooldown]);

    useEffect(() => {
        // if user leaves the page, set the plant to idle even if watering/stopping and set watering percentage back to 0
        return () => {
            dispatch(
                editPlantAsync({
                    ...plant, 
                    status: WateringStatus.Idle, 
                    wateringPercentage: 0
                })
            );
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[dispatch]);


    var showWateringNotice = plant.lastWateredTime === null ? 
                            true : 
                            moment.duration(currentTime.diff(moment(plant.lastWateredTime, DotNetDateFormat))).asHours() >= 6;
        return (
        <div className={styles["plant-container"]}>
        <div className={styles["plant-image"]}>
            <RiPlantLine />
        </div>
        <div className={styles["plant-details"]}>
        
            <div className={styles["plant-name"]}>Name: {plant.name}</div>
            <div className={styles["watering-option"]}>
                <button
                    className={styles["watering-button"]}
                    onClick={startWatering}
                    disabled={isWatering || cooldown}
                >
                    Start Watering
                </button>
                <button
                    className={styles["watering-button"]}
                    onClick={stopWatering}
                    disabled={!isWatering}
                >
                    Stop Watering

                </button>
            </div>
            <div className={styles["watering-time"]}>
                <span>Last watering time: </span>
                <span>{plant.lastWateredTime ? moment(plant.lastWateredTime, DotNetDateFormat).format("lll") : "N/A"}</span>
            </div>
            <div className={styles["watering-status"]}>
                <div>Watering status:</div>
                <span>{WateringStatus[updatedWateringStatus]}</span>
                <div>
                    <span>{updatedWateringPercentage}%</span>
                    <div className={styles["water-indicator"]}>
                        <div className={styles["water-bar"]} style={{width: `${clamp(updatedWateringPercentage, 0, 100)}%`}}></div>
                    </div>
                </div>
            </div>
            {showWateringNotice && <div className={styles.warning}>6h has passed since this plant was last watered</div>}
        </div>
    </div>);
}

export default Plant;