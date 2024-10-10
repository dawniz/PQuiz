import tryCatchWrapper from "../middlewares/tryCatchWrapper.js";
import { getRandomNumber } from "../utils.js";
import pool from "../db.js";
import { getSinglePokemonForApp } from "../controllers/pokemon.js";
import { getPokemonTypesOfPokemonFormForApp } from "../controllers/pokemonFormPokemonType.js";
import { arrayShuffle } from "../utils.js";
import { createCustomError } from "../customError.js";

const QuestionType = {
  SILHOUETTES_CHOICES: "silhouettes_choices",
  SILHOUETTES_FULLNAME: "silhouettes_fullname",
  SILHOUETTES_TYPES: "silhouettes_types",
};

async function getPokemonFormsByGeneration(generationId) {
  let sql = `SELECT * FROM PokemonForm WHERE generationId=?`;
  const [rows] = await pool.query(sql, generationId);
  return rows;
}

/**
 * @returns note object
 */
async function createQuestions(questionsCount, type, generationId) {
  const formsArr = await getPokemonFormsByGeneration(generationId);
  const randomIndexes = [];
  const randomForms = [];
  const correctAnswers = [];
  const imagesArr = [];
  let answersArray = [];

  for (let i = 0; i < questionsCount; i++) {
    randomIndexes.push(getRandomNumber(0, formsArr.length - 1));
    randomForms.push(formsArr[randomIndexes[i]]);
    imagesArr.push({
      visible: `assets/pokemons/${randomForms[i].sprite}.webp`,
      invisible: `assets/pokemons/${randomForms[i].sprite}-s.webp`,
    });
    answersArray.push([]);
    switch (type) {
      case QuestionType.SILHOUETTES_CHOICES: {
        let randomFormsIndexes = [...Array(3)].map(() => {
          return getRandomNumber(0, formsArr.length - 1);
        });
        randomFormsIndexes.push(randomIndexes[i]);
        while (
          !randomFormsIndexes.every((value) => {
            return (
              randomFormsIndexes.indexOf(value) ===
              randomFormsIndexes.lastIndexOf(value)
            );
          })
        ) {
          //check uniqueness of every random answer
          const uniqueValues = [...new Set(randomFormsIndexes)]; //create Set - collection of unique values and then turn it into array again
          randomFormsIndexes = uniqueValues;
          for (let j = 0; j < 4 - uniqueValues.length; j++) {
            //if array have less than 4 elements - add random index again
            randomFormsIndexes.push(getRandomNumber(0, formsArr.length - 1));
          }
        }
        for (let j = 0; j < randomFormsIndexes.length; j++) {
          answersArray[i].push(
            (
              await getSinglePokemonForApp(
                formsArr[randomFormsIndexes[j]].pokemonId,
              )
            ).name,
          );
          if (randomFormsIndexes[j] == randomIndexes[i]) {
            correctAnswers.push(answersArray[i][j]);
          }
        }
        answersArray[i] = arrayShuffle(answersArray[i]);
        break;
      }
      case QuestionType.SILHOUETTES_TYPES: {
        // const correctTypes = await prisma.pokemonFormPokemonType.findMany({
        //     where: {
        //         pokemonFormId: randomEntry!.id
        //     },
        //     select:{
        //         pokemonType: true
        //     },
        // })
        const correctTypes = await getPokemonTypesOfPokemonFormForApp(
          formsArr[randomIndexes[i]].id,
        );
        correctAnswers.push(correctTypes.map((ct) => ct.name));
        break;
      }
      case QuestionType.SILHOUETTES_FULLNAME:
        correctAnswers.push(
          (await getSinglePokemonForApp(formsArr[randomIndexes[i]].pokemonId))
            .name,
        );
    }
  }
  switch (type) {
    case QuestionType.SILHOUETTES_CHOICES:
      return correctAnswers.map((answer, index) => {
        return {
          correctAnswer: answer,
          images: imagesArr[index],
          answers: answersArray[index],
        };
      });
    case QuestionType.SILHOUETTES_TYPES: {
      const pokemonNames = [];
      for (const form of randomForms) {
        pokemonNames.push((await getSinglePokemonForApp(form.pokemonId)).name);
      }
      // for (let i = 0; i < questi; i++) {
      //     pokemonNames.push((await getSinglePokemonForApp(formsArr[randomFormsIndexes[j]].pokemonId)).name);
      // }
      return correctAnswers.map((answer, index) => {
        return {
          correctAnswers: answer,
          images: imagesArr[index],
          pokemonName: pokemonNames[index],
        };
      });
    }
    case QuestionType.SILHOUETTES_FULLNAME:
      return correctAnswers.map((answer, index) => {
        return {
          correctAnswer: answer,
          images: imagesArr[index],
        };
      });
  }
}

/**
 * @description Get Questions
 * @route GET /question/:count/:type/:generationId
 */
export const getQuestions = tryCatchWrapper(async function (req, res, next) {
  const { count, type, generationId } = req.params;

  const questions = await createQuestions(
    parseInt(count),
    type,
    parseInt(generationId),
  );
  if (!questions) return next(createCustomError("Questions not found", 404));

  return res.status(200).json(questions);
});
