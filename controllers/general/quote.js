import cron from "cron";

const TODAY_QUOTE = {
    quote: "The best way to predict the future is to create it.",
    author: "Abraham Lincoln"
}

const getQuote = async () => {
    // console.log("Getting quote")
    const response = await fetch("https://api.quotable.io/random?maxLength=50");
    const data = await response.json();
    TODAY_QUOTE.quote = data.content;
    TODAY_QUOTE.author = data.author;
}

cron.job("* * * * *", async () => {
    await getQuote();
})

export default async (req, res) => {
    res.status(200).send(TODAY_QUOTE);
}