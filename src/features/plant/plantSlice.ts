import { CaseReducer, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Plant } from './plantTypes';
import axios from '../../axios';

export interface PlantState {
  plants: Plant[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: PlantState = {
  plants: [],
  status: 'idle',
};


export const addPlantAsync = createAsyncThunk(
  'plant/addPlant',
  async (newPlant: Pick<Plant, 'name'>) => {
    const response = await axios.post<Plant>('plants', newPlant);
    return response.data;
  }
);

export const fetchPlantsAsync = createAsyncThunk(
    'plant/fetchPlants',
    async () => {
      const response = await axios.get<Plant[]>('plants');
      return response.data;
    }
);

export const fetchPlantByIdAsync = createAsyncThunk(
    'plant/fetchPlantById',
    async (id: number) => {
      const response = await axios.get<Plant>(`plants/${id}`);
      return response.data;
    }
);

export const editPlantAsync = createAsyncThunk(
    'plant/editPlant',
    async (editedPlant: Plant) => {
      const response = await axios.put<Plant>(`plants/${editedPlant.id}`, editedPlant);
      return response.data;
    }
);

export const deletePlantAsync = createAsyncThunk(
    'plant/deletePlant',
    async (id: number) => {
      const response = await axios.delete<Plant>(`plants/${id}`);
      return response.data;
    }
);


const plantsLoading : CaseReducer<PlantState> = (state) => {
    state.status = 'loading';
}

const plantsLoadingFailed : CaseReducer<PlantState> = (state) => {
    state.status = 'failed';
}

export const plantSlice = createSlice({
  name: 'plant',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(addPlantAsync.pending, plantsLoading)
      .addCase(fetchPlantsAsync.pending, plantsLoading)
      .addCase(fetchPlantByIdAsync.pending, plantsLoading)
      .addCase(editPlantAsync.pending, plantsLoading)
      .addCase(deletePlantAsync.pending, plantsLoading)
      .addCase(addPlantAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.plants.push(action.payload);
      })
      .addCase(fetchPlantsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.plants = action.payload;
      })
      .addCase(fetchPlantByIdAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.plants = state.plants.map(p => p.id === action.payload.id? action.payload : p);
      })
      .addCase(editPlantAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.plants = state.plants.map(p => p.id === action.payload.id? action.payload : p);
      })
      .addCase(deletePlantAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.plants = state.plants.filter(p => p.id !== action.payload.id);
      })
      .addCase(addPlantAsync.rejected, plantsLoadingFailed)
      .addCase(fetchPlantsAsync.rejected, plantsLoadingFailed)
      .addCase(fetchPlantByIdAsync.rejected, plantsLoadingFailed)
      .addCase(editPlantAsync.rejected, plantsLoadingFailed)
      .addCase(deletePlantAsync.rejected, plantsLoadingFailed);
  },
});

// export const { } = counterSlice.actions;

export const selectPlantState = (state: RootState) => state.plant;

export default plantSlice.reducer;
