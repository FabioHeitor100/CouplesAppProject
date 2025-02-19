import { StackNavigationProp } from '@react-navigation/stack';
import { Activity } from '../types/activityType';

// Define available screens and their parameters
export type RootStackParamList = {
  Home: undefined;
  Swipe: { useDefault : boolean};
  SwipeMore: { Activities : Activity[], myId: string, partnerId: string};
  Connect: undefined;
  Match: { activity: Activity, solo : boolean }; // Match screen requires an "activity" parameter
  MemoryLog: undefined;
  CustomActivities: undefined;
  Challenge: { remainingActivities: string[] };
  Premium: undefined;
  StartManager: undefined;
  Activity: { activity?: Activity, index?: number};
};

// Type for navigation prop
export type NavigationProps<T extends keyof RootStackParamList> = StackNavigationProp<
  RootStackParamList,
  T
>;
