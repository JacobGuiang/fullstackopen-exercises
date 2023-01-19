interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (
  dailyExercises: Array<number>,
  target: number
): ExerciseResult => {
  const average =
    dailyExercises.reduce((acc, cur) => (acc += cur), 0) /
    dailyExercises.length;
  const periodLength = dailyExercises.length;
  const trainingDays = dailyExercises.reduce(
    (acc, cur) => (acc += cur > 0 ? 1 : 0),
    0
  );
  const success = average >= target;

  let rating, ratingDescription;
  if (average >= target) {
    rating = 3;
    ratingDescription = 'good';
  } else {
    if (average < target * 0.75) {
      rating = 1;
      ratingDescription = 'bad';
    } else {
      rating = 2;
      ratingDescription = 'ok';
    }
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

// interface ExerciseVals {
//   dailyExercises: Array<number>;
//   target: number;
// }

// const parseExerciseArgs = (args: Array<string>): ExerciseVals => {
//   if (args.length < 4) throw new Error('Not enough arguments');
//   if (args.slice(3).every((val) => !isNaN(Number(val)))) {
//     return {
//       target: Number(args[2]),
//       dailyExercises: args.slice(3).map((val) => Number(val)),
//     };
//   } else {
//     throw new Error('Provided values were not numbers!');
//   }
// };

// try {
//   const { dailyExercises, target } = parseExerciseArgs(process.argv);
//   console.log(calculateExercises(dailyExercises, target));
// } catch (error: unknown) {
//   let errorMessage = 'Something bad happened.';
//   if (error instanceof Error) {
//     errorMessage += ' Error: ' + error.message;
//   }
//   console.log(errorMessage);
// }
