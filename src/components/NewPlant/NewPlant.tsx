import React, { useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { addPlantAsync } from '../../features/plant/plantSlice';
import { Plant } from '../../features/plant/plantTypes';
import ErrorNotice from '../ErrorNotice/ErrorNotice';
import styles from './NewPlant.module.css';

interface NewPlantProps {
    plants: Plant[];
}

const NewPlant: React.FC<NewPlantProps> = ({
    plants
}) => {
        const dispatch = useAppDispatch();
        const [newPlantName, setNewPlantName] = useState("");
        const [error, setError] = useState("");

        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (newPlantName.trim() && plants.every(p => p.name !== newPlantName)){
                try {
                    await dispatch(addPlantAsync({ name: newPlantName }));
                    alert("Successfully added plant");
                    setNewPlantName("");
                }catch(err){
                    alert("Failed to add plant");
                }
            }else{
                setError("Invalid plant name. Name must also be unique.");
            }
        }

        return (
        <div className={`${styles["plant-container"]} ${styles["plant-form-wrapper"]}`}>
            <form 
                className={styles["plant-form"]} 
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Enter plant name" 
                    required 
                    onChange={e => setNewPlantName(e.target.value)}
                    value={newPlantName}   
                />
                {error && <ErrorNotice message={error} clearError={() => setError('')} />}
                <input type="submit" value="Add new plant" />
            </form>
        </div>
        );
}

export default NewPlant;