import PokeAPI from "pokedex-promise-v2";
import db from "./db.js";

var api = new PokeAPI();

const listSpecies = async () => {
  let species = await api.getPokemonSpeciesList();
  let filtered = species.results.map((s) => s.name);
  return filtered;
};

const listTypes = async () => {
  let types = await api.getTypesList();
  let filtered = types.results.map((t) => {
    return { name: t.name };
  });
  return filtered;
};

const listGenerations = async () => {
  const promiseArr = [];
  const generationsNames = [];
  const generationsArr = [];
  await api
    .getGenerationsList()
    .then((data) =>
      generationsNames.push(
        data.results.map((g) => {
          return g.name;
        }),
      ),
    )
    .catch((_) => {
      throw Error("getGenerationData ERROR " + _);
    });
  for (let i = 0; i < generationsNames.length; i++) {
    promiseArr.push(api.getGenerationByName(generationsNames[i]));
  }
  await Promise.all(promiseArr).then((data) => {
    data[0].forEach((g) => {
      generationsArr.push({
        name: g.name,
        regionName: g.main_region.name,
      });
    });
  });
  return generationsArr;
};

export const clearAndSeed = async () => {
  const generationsList = await listGenerations();
  console.log("Generations fetched...");
  const typesList = await listTypes();
  console.log("Types fetched...");
  const list = await listSpecies();
  const promiseArr = [];

  for (let i = 0; i < list.length; i++) {
    promiseArr.push(api.getPokemonSpeciesByName(list[i]));
  }

  console.log(`Pokemon species found: ${list.length}`);
  const result = await Promise.allSettled(promiseArr);
  const pokObjPromises = await result.map(async (r) => {
    if (r.status !== "fulfilled") return null;
    const s = r.value;
    const varietiesArr = s.varieties
      .map((v) => v.pokemon.name)
      .map(async (n) => await api.getPokemonByName(n));
    const varietiesResolved = await Promise.allSettled(varietiesArr);
    const varieties = varietiesResolved.map((v) =>
      v.status === "fulfilled" ? v.value : null,
    );
    const formsArr = varieties.map((p) => ({
      name: p.name,
      generation: s.generation.name,
      types: p.types.map((t) => ({ name: t.type.name })),
      sprite: `${p.id.toString()}`,
    }));
    return {
      pokeDexId: s.pokedex_numbers[0].entry_number,
      name: s.name,
      forms: formsArr,
    };
  });
  const pokObj = (await Promise.allSettled(pokObjPromises))
    .map((r) => r.value)
    .filter(Boolean);
  console.log("Pokemons fetched...");

  // await db.query('SELECT CONCAT(`DROP TABLE `, TABLE_NAME FROM INFORMATION_SCHEMA.tables WHERE TABLE_SCHEMA = ?', process.env.DB_NAME,
  //     function(err, results){
  //         if (err) {
  //             console.log('error in clearing database', err);
  //             return;
  //         }
  // });

  await db
    .query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`)
    .catch((error) => {
      console.log("error in clearing database", error);
      return;
    });

  await db.query(`CREATE DATABASE ${process.env.DB_NAME}`).catch((error) => {
    console.log("error in creating database", error);
    return;
  });

  // await prisma.$transaction([
  //     prisma.pokemon.deleteMany(),
  //     prisma.generation.deleteMany(),
  //     prisma.pokemonForm.deleteMany(),
  //     prisma.pokemonType.deleteMany(),
  //     prisma.pokemonFormPokemonType.deleteMany(),
  //     prisma.meta.deleteMany()
  // ]);

  console.log("DB cleared...");

  // await prisma.$queryRaw`ALTER TABLE PokemonType AUTO_INCREMENT = 1`;
  // await prisma.$queryRaw`ALTER TABLE Pokemon AUTO_INCREMENT = 1`;
  // await prisma.$queryRaw`ALTER TABLE PokemonForm AUTO_INCREMENT = 1`;
  // await prisma.$queryRaw`ALTER TABLE Generation AUTO_INCREMENT = 1`;
  // await prisma.$queryRaw`ALTER TABLE PokemonFormPokemonType AUTO_INCREMENT = 1`;
  // await prisma.$queryRaw`ALTER TABLE Meta AUTO_INCREMENT = 1`;
  // console.log('Resetted auto increment to 1 for all tables');

  await db.query(`USE ${process.env.DB_NAME}`).catch((error) => {
    console.log("error in setting default database", error);
    return;
  });

  console.log("Default database set...");

  await db
    .query(
      `CREATE TABLE PokemonType (
        id INTEGER NOT NULL AUTO_INCREMENT,
        name VARCHAR(191) NOT NULL,
        disabled BOOL NOT NULL,
        UNIQUE INDEX PokemonType_name_key(name),
        PRIMARY KEY (id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    )
    .catch((error) => {
      if (error) {
        console.log("error in creating PokemonType table", error);
        return;
      }
    });

  await db
    .query(
      `CREATE TABLE Pokemon (
        id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
        pokeDexId INTEGER NOT NULL,
        name VARCHAR(191) NOT NULL,
        UNIQUE KEY(name)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    )
    .catch((error) => {
      if (error) {
        console.log("error in creating Pokemon table", error);
        return;
      }
    });

  await db
    .query(
      `CREATE TABLE Generation (
        id INTEGER NOT NULL AUTO_INCREMENT,
        name VARCHAR(191) NOT NULL,
        regionName VARCHAR(191) NOT NULL,
        UNIQUE INDEX Generation_name_key(name),
        PRIMARY KEY (id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    )
    .catch((error) => {
      if (error) {
        console.log("error in creating Generation table", error);
        return;
      }
    });

  await db
    .query(
      `CREATE TABLE PokemonForm (
        id INTEGER NOT NULL AUTO_INCREMENT,
        name VARCHAR(191) NOT NULL,
        pokemonId INTEGER NOT NULL,
        generationId INTEGER NOT NULL,
        sprite VARCHAR(191) NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (pokemonId) REFERENCES Pokemon (id),
        FOREIGN KEY (generationId) REFERENCES Generation(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    )
    .catch((error) => {
      if (error) {
        console.log("error in creating PokemonForm table", error);
        return;
      }
    });

  await db
    .query(
      `CREATE TABLE PokemonFormPokemonType (
        id INTEGER NOT NULL AUTO_INCREMENT,
        pokemonFormId INTEGER NOT NULL,
        pokemonTypeId INTEGER NOT NULL,
        UNIQUE INDEX PokemonFormPokemonType_pokemonFormId_pokemonTypeId_key(pokemonFormId, pokemonTypeId),
        PRIMARY KEY (id),
        FOREIGN KEY (pokemonFormId) REFERENCES PokemonForm (id),
        FOREIGN KEY (pokemonTypeId) REFERENCES PokemonType (id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    )
    .catch((error) => {
      if (error) {
        console.log("error in creating PokemonFormPokemonType", error);
        return;
      }
    });

  await db
    .query(
      `CREATE TABLE Meta (
        name VARCHAR(192) NOT NULL,
        value VARCHAR(192) NOT NULL,
        PRIMARY KEY(name)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    )
    .catch((error) => {
      if (error) {
        console.log("error in creating Meta", error);
        return;
      }
    });

  // await db.query(`ALTER TABLE PokemonForm ADD CONSTRAINT PokemonForm_pokemonId_fkey FOREIGN KEY (pokemonId) REFERENCES Pokemon(id) ON DELETE RESTRICT ON UPDATE CASCADE`)
  //     .then((results) => {

  //     })
  //     .catch((error) => {
  //         if (error) {
  //             console.log('error in adding foreign key (pokemonId in PokemonForm) to (id in Pokemon) in PokemonForm table', error);
  //             return;
  //         }
  //     });
  // await db.query(`ALTER TABLE PokemonForm ADD CONSTRAINT PokemonForm_generationId_fkey FOREIGN KEY (generationId) REFERENCES Generation(id) ON DELETE RESTRICT ON UPDATE CASCADE`)
  //     .then((results) => {

  //     })
  //     .catch((error) => {
  //         if (error) {
  //             console.log('error in adding foreign key (generationId in PokemonForm) to (id in Generation) in PokemonForm table', error);
  //             return;
  //         }
  //     });
  // await db.query(`ALTER TABLE PokemonFormPokemonType ADD CONSTRAINT PokemonFormPokemonType_pokemonFormId_fkey FOREIGN KEY (pokemonFormId) REFERENCES PokemonForm(id) ON DELETE RESTRICT ON UPDATE CASCADE`)
  //     .then((results) => {

  //     })
  //     .catch((error) => {
  //         if (error) {
  //             console.log('error in adding foreign key (pokemonFormId in PokemonFormPokemonType) to (id in PokemonForm) in PokemonFormPokemonType table', error);
  //             return;
  //         }
  //     });
  // await db.query(`ALTER TABLE PokemonFormPokemonType ADD CONSTRAINT PokemonFormPokemonType_pokemonTypeId_fkey FOREIGN KEY (pokemonTypeId) REFERENCES PokemonType(id) ON DELETE RESTRICT ON UPDATE CASCADE`)
  //     .then((results) => {

  //     })
  //     .catch((error) => {
  //         if (error) {
  //             console.log('error in adding foreign key (pokemonTypeId in PokemonFormPokemonType) to (id in PokemonType) in PokemonFormPokemonType table', error);
  //             return;
  //         }
  //     });

  var queryTypes = `INSERT INTO PokemonType (name, disabled) VALUES `;
  var typesRowAddedCount = 0;

  typesList.forEach((type, index) => {
    const disabledValue =
      type.name == "stellar" || type.name == "unknown" || type.name == "shadow"
        ? 1
        : 0;
    queryTypes = queryTypes.concat(
      `${index != 0 ? "," : ""}(${db.escape(type.name)},${disabledValue})`,
    );
    typesList[index].id = index + 1;
    typesList[index].disabledValue = disabledValue;
  });

  await db
    .query(queryTypes)
    .then((results) => {
      typesRowAddedCount = results[0].affectedRows;
    })
    .catch((error) => {
      if (error) {
        console.log("error in populating PokemonType table", error);
        return;
      }
    });
  console.log(`Types added: ${typesRowAddedCount}`);

  // await prisma.pokemonType.createMany({
  //     data: typesList.map((t) =>
  //         (t == "stellar" || t == "unknown" || t == "shadow") ? { name: t }: {name: t, disabled: true}
  //     )
  // });
  // const typesData = await prisma.pokemonType.findMany();

  var queryGenerations = `INSERT INTO Generation (name, regionName) VALUES `;
  var generationsRowAddedCount = 0;

  generationsList.forEach((generation, index) => {
    queryGenerations = queryGenerations.concat(
      `${index != 0 ? "," : ""}(${db.escape(generation.name)},${db.escape(generation.regionName)})`,
    );
    generationsList[index].id = index + 1;
  });

  await db
    .query(queryGenerations)
    .then((results) => {
      generationsRowAddedCount = results[0].affectedRows;
    })
    .catch((error) => {
      if (error) {
        console.log("error in populating Generation table", error);
        return;
      }
    });
  console.log(`Generation added: ${generationsRowAddedCount}`);

  // await prisma.generation.createMany({
  //     data: generationsList
  // });
  // const generationData = await prisma.generation.findMany();

  var queryPokemons = `INSERT INTO Pokemon (pokeDexId, name) VALUES `;
  var pokemonsRowAddedCount = 0;

  pokObj.forEach((pokemon, index) => {
    queryPokemons = queryPokemons.concat(
      `${index != 0 ? "," : ""}(${db.escape(pokemon.pokeDexId)},${db.escape(pokemon.name)})`,
    );
    pokObj[index].id = index + 1;
  });

  await db
    .query(queryPokemons)
    .then((results) => {
      pokemonsRowAddedCount = results[0].affectedRows;
    })
    .catch((error) => {
      if (error) {
        console.log("error in populating Pokemon table", error);
        return;
      }
    });
  console.log(`Pokemons added: ${pokemonsRowAddedCount}`);

  // await prisma.pokemon.createMany({
  //     data: pokemonData
  // });
  // const createdPokemon = await prisma.pokemon.findMany();

  const pokemonFormsList = [];
  const pokemonFormPokemonTypesData = [];

  for (const pokemon of pokObj) {
    const foundPokemon = pokObj.find((p) => p.pokeDexId === pokemon.pokeDexId);
    for (const form of pokemon.forms) {
      const foundGeneration = generationsList.find(
        (g) => g.name === form.generation,
      );
      const pokemonForm = {
        name: form.name,
        generationId: foundGeneration.id,
        pokemonId: foundPokemon.id,
        sprite: form.sprite,
      };
      pokemonFormsList.push(pokemonForm);
      for (const type of form.types) {
        const foundType = typesList.find((t) => t.name === type.name);
        pokemonFormPokemonTypesData.push({
          pokemonTypeId: foundType.id,
          pokemonFormName: form.name,
        });
      }
    }
  }

  var queryForms = `INSERT INTO PokemonForm (name, pokemonId, generationId, sprite) VALUES `;
  var formsRowAddedCount = 0;

  pokemonFormsList.forEach((forms, index) => {
    queryForms = queryForms.concat(
      `${index != 0 ? "," : ""}(${db.escape(forms.name)},${db.escape(forms.pokemonId)},${db.escape(forms.generationId)},${db.escape(forms.sprite)})`,
    );
    pokemonFormsList[index].id = index + 1;
  });

  await db
    .query(queryForms)
    .then((results) => {
      formsRowAddedCount = results[0].affectedRows;
    })
    .catch((error) => {
      if (error) {
        console.log("error in populating PokemonForm table", error);
        return;
      }
    });

  // await prisma.pokemonForm.createMany({
  // data: pokemonFormsData
  // });
  // const createdPokemonForms = await prisma.pokemonForm.findMany();

  console.log(`Pokemon forms added: ${formsRowAddedCount}`);

  var formTypeRelationQuery = `INSERT INTO PokemonFormPokemonType (pokemonFormId, pokemonTypeId) VALUES `;
  var formTypeRelationRowAddedCount = 0;
  pokemonFormPokemonTypesData.forEach((relation, index) => {
    const form = pokemonFormsList.find(
      (f) => f.name === relation.pokemonFormName,
    );
    relation.pokemonFormId = form.id;
    delete relation.pokemonFormName;
    formTypeRelationQuery = formTypeRelationQuery.concat(
      `${index != 0 ? "," : ""}(${db.escape(relation.pokemonFormId)},${db.escape(relation.pokemonTypeId)})`,
    );
  });

  // await prisma.pokemonFormPokemonType.createMany({
  //     data: pokemonFormPokemonTypesData
  // });

  await db
    .query(formTypeRelationQuery)
    .then((results) => {
      formTypeRelationRowAddedCount = results[0].affectedRows;
    })
    .catch((error) => {
      if (error) {
        console.log("error in populating PokemonFormPokemonType table", error);
        return;
      }
    });

  console.log(
    `Pokemon form types relations added: ${formTypeRelationRowAddedCount}`,
  );
  // await prisma.meta.createMany({
  //     data: [
  //         {
  //             name: "pokemonFormsCount",
  //             value: formsRowAddedCount.toString()
  //         },
  //     ]
  // })
  var metaRowAddedCount = 0;

  await db
    .query(
      `INSERT INTO Meta (name, value) VALUES (${db.escape("pokemonFormsCount")}, ${db.escape(formsRowAddedCount.toString())} )`,
    )
    .then((results) => {
      metaRowAddedCount = results[0].affectedRows;
    })
    .catch((error) => {
      if (error) {
        console.log("error in populating Meta table", error);
        return;
      }
    });
  console.log(`Meta values generated: ${metaRowAddedCount}`);
  console.log("--- Data fetched to database successfully ---");
};

export default clearAndSeed;

// --- CREATE IF NOT EXIST
// CREATE DATABASE IF NOT EXISTS DBName;

// ---DROP EVERYTHING---
// SELECT CONCAT('DROP TABLE ', TABLE_NAME, ';')
// FROM INFORMATION_SCHEMA.tables
// WHERE TABLE_SCHEMA = 'your_database_name'
