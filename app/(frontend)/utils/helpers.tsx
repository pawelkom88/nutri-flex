import { toast } from 'sonner';
import { Check, X } from 'lucide-react';
import React from 'react';
import { ApiExercise } from '@/app/(frontend)/api/public-api';
import {
  DIFFICULTY_OPTIONS,
  DifficultyOption,
  EQUIPMENT_OPTIONS,
  EquipmentOption,
  SORT_OPTIONS,
  SortOption,
} from '@/app/(frontend)/utils/constants';
import type { Exercises } from '@/app/(frontend)/workouts/_components/workout-form-types';
import { goals } from '@/components/goal-progress';

export const capitalizeAll = (str: string): string => {
  return str
    .split(' ')
    .map(word => word.toUpperCase())
    .join(' ');
};

export const capitalize = (str: string): string => {
  if (str.includes('_') || str.includes('-')) {
    return str
      .split('_')
      .map(word => capitalize(word))
      .join(' ');
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-tertiary';
    case 'intermediate':
      return 'bg-quinary';
    case 'expert':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

export const showSuccessToast = ({ title, description, duration }: ToastOptions) => {
  toast(title, {
    className: 'bg-green-50 border-green-200 text-green-900',
    duration: duration || 3000,
    description,
    position: 'top-center',
    icon: (
      <div className="rounded-full p-1 bg-green-700">
        <Check className="h-3 w-3 text-white" />
      </div>
    ),
  });
};

interface ErrorToastOptions {
  title: string;
  description: string;
}

export const showErrorToast = ({ title, description }: ErrorToastOptions) => {
  toast(title, {
    description,
    position: 'top-center',
    className: 'bg-red-50 border-red-200',
    icon: (
      <div className="rounded-full p-1 bg-red-700">
        <X className="h-3 w-3 text-white" />
      </div>
    ),
  });
};

export const sortExercises = (exercises: ApiExercise[], filterState: FilterState) => {
  const difficultyOrder = { beginner: 1, intermediate: 2, expert: 3 };
  return exercises.toSorted((a, b) => {
    switch (filterState.sortBy) {
      case SORT_OPTIONS.NAME_ASC:
        return a.name.localeCompare(b.name);
      case SORT_OPTIONS.NAME_DESC:
        return b.name.localeCompare(a.name);
      case SORT_OPTIONS.DIFFICULTY_ASC:
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case SORT_OPTIONS.DIFFICULTY_DESC:
        return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
      default:
        return 0;
    }
  });
};

export const filterExercises = (
  exercises: ApiExercise[],
  filterState: FilterState
): ApiExercise[] => {
  if (!exercises || exercises.length === 0) {
    return [];
  }

  let result = [...exercises];

  if (filterState.equipment !== EQUIPMENT_OPTIONS.all) {
    result = result.filter(exercise => exercise.equipment === filterState.equipment);
  }

  if (filterState.difficulty !== DIFFICULTY_OPTIONS.all) {
    result = result.filter(exercise => exercise.difficulty === filterState.difficulty);
  }

  return result;
};

export interface FilterState {
  equipment: EquipmentOption;
  difficulty: DifficultyOption;
  sortBy: SortOption;
  isOpen: boolean;
}

export const applyFiltersAndSort = (
  exercises: ApiExercise[],
  filterState: FilterState
): ApiExercise[] => {
  const filtered = filterExercises(exercises, filterState);
  return sortExercises(filtered, filterState);
};

export const getExerciseDisplayName = (exercise: Exercises[number], index: number) => {
  if (exercise.exerciseName) {
    return exercise.exerciseName;
  }
  return `New Exercise ${index + 1}`;
};

type Goal = (typeof goals)[number];

export const getFillColor = (goalName: Goal['name']): string => {
  switch (goalName) {
    case 'Weekly Workouts':
      return 'bg-primary';
    case 'Daily Water':
      return 'bg-quinary';
    case 'Calories Goal':
      return 'bg-calories';
    case 'Protein Intake':
      return 'bg-quaternary';
    default:
      return 'bg-primary';
  }
};

export const calculateNutrition = (
  nutritionData: { calories: number; protein: number; carbs: number; fat: number },
  grams: number
) => {
  const { calories, protein, carbs, fat } = nutritionData;

  return {
    calories: (calories * grams) / 100,
    protein: (protein * grams) / 100,
    carbs: (carbs * grams) / 100,
    fat: (fat * grams) / 100,
  };
};

export function constructApiUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000';
  return `${baseUrl}${path}`;
}

type Sex = 'male' | 'female';
export type ActivityLevel = 'none' | 'light' | 'moderate' | 'heavy';
export type FoodData = {
  kcal: number;
};

export function calculateHydrationGoal(
  weightKg: number,
  activityLevel: ActivityLevel,
  sex: Sex,
  initialFoodDataKcal?: number
): number {
  // Baseline water intake (mL/kg)
  const mlPerKgBaseline = sex === 'male' ? 40 : 35;
  const baselineMl = weightKg * mlPerKgBaseline;

  // Additional water for exercise (based on ~355 mL per 30 min)
  const activityAdditionMl = (() => {
    switch (activityLevel) {
      case 'none':
        return 0;
      case 'light':
        return 300; // ~15-30 min
      case 'moderate':
        return 600; // ~30-60 min
      case 'heavy':
        return 1000; // >60 min
      default:
        return 0;
    }
  })();

  // Total plain water requirement before food adjustment
  const totalMl = baselineMl + activityAdditionMl;

  // Subtract metabolic water from food, if provided
  let metabolicWaterMl = 0;
  if (initialFoodDataKcal) {
    metabolicWaterMl = initialFoodDataKcal * 0.12;
  } else {
  }

  const adjustedMl = totalMl - metabolicWaterMl;

  // Ensure non-negative and round
  return Math.max(0, Math.round(adjustedMl));
}

export function calculatedProteinIntake(weight: number, activity: ActivityLevel, sex: Sex) {
  let proteinPerKg: number;

  switch (activity) {
    case 'none':
      proteinPerKg = 0.8;
      break;
    case 'light':
      proteinPerKg = 1.2;
      break;
    case 'moderate':
      proteinPerKg = 1.4;
      break;
    case 'heavy':
      proteinPerKg = 1.6;
      break;
    default:
      proteinPerKg = 0.8;
  }

  return weight * proteinPerKg;
}
