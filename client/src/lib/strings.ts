
const strings:Map<string, string> = new Map([
    ["silhouettes_choices", "Silhouettes with 4 choices"],
    ["silhouettes_fullname", "Silhouettes with name typing"],
    ["silhouettes_types", "Silhouettes with choosing types"],
    ['generation-i', "Generation I"],
    ['generation-ii', "Generation II"],
    ['generation-iii', "Generation III"],
    ['generation-iv', "Generation IV"],
    ['generation-v', "Generation V"],
    ['generation-vi', "Generation VI"],
    ['generation-vii', "Generation VII"],
    ['generation-viii', "Generation VIII"],
    ['generation-ix', "Generation IX"],
    ['modal_text', "Do you want to abandon quiz?"],
    ['modal_text_offline', "App offline..."],
    ['modal_text_error', 'Error'],
    ['yes', "Yes"],
    ['no', "No"],
    ['refresh', "Refresh"],
    ['next-question', "Next question"],
]);


export default function getString(key: string) { 
    if(strings.has(key))
        return strings.get(key)!;
    else
        return "";
}