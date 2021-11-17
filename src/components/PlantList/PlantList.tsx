import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { fetchPlantsAsync, selectPlantState } from '../../features/plant/plantSlice';
import NewPlant from '../NewPlant/NewPlant';
import Plant from '../Plant/Plant';
import styles from './PlantList.module.css';


const PlantList: React.FC = () => {

        const { 
            plants, 
            // status 
        } = useAppSelector(selectPlantState);
        const dispatch = useAppDispatch();

        useEffect(() => {
            dispatch(fetchPlantsAsync());
        }, [dispatch]);

        return (
            <div className={`${styles.page} ${styles["main-page"]}`}>
                <div className={styles["all-plants"]}>
                    {plants.map(plant => {
                        // const isWatering = plantsToWater.hasOwnProperty(plant.id);
                        return <Plant 
                                    key={plant.id}
                                    plant={plant}
                                />
                    })}
                    <NewPlant 
                        plants={plants}
                    />
                </div>
            </div>
        );
}

export default PlantList;