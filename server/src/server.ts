require("dotenv").config();
// const httpParser = require('http-string-parser')
import http from "http";
import { Client } from "@notionhq/client";
import { PartialPageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import exp from "constants";

// The dotenv library will read from your .env file into these values on `process.env`
const notionDatabaseId = process.env.NOTION_DB_ID;
const notionSecret = process.env.NOTION_API_KEY;

// Will provide an error to users who forget to create the .env file
// with their Notion data in it
if (!notionDatabaseId || !notionSecret) {
    throw Error("Must define NOTION_SECRET and NOTION_DATABASE_ID in env");
}

// Initializing the Notion client with your secret
const notion = new Client({
    auth: notionSecret,
});

const host = "localhost";
const port = 8000;

async function addPage(name: string, category: string, date: Date, amount: number) {
    const parents = new Map<Number, Map<String, String>>();
    parents.set(2, new Map([ // March
        ["misc", "21a810d6-06fc-4353-87d8-b46cc6bf271a"],
        ["sub", "c974ef3809c54f76bdab216c44b2e53d"],
        ["food", "619bea6ed5a04a969f2d212536ca6e9c"]
    ]));
    parents.set(3, new Map([ // Apr
        ["misc", "e45c975532384faaa6485e379199a7d6"],
        ["sub", "2b5c23354204458bb0d129f39f10d4d2"],
        ["food", "673760b6726544379227c92ac3a537ae"],
        ["etransferwithdrawal", "fb04c4e1d8804fef81ce97a6ad650cfc"],
        ["etransferdeposit", "fb04c4e1d8804fef81ce97a6ad650cfc"]
    ]));
    parents.set(4, new Map([ // May
        ["misc", "902dd350fa134301bcc8c86174ec7823"],
        ["sub", "092ca367b1e34706bfbac8fc78def8b9"],
        ["food", "4db6dc324747482ba17713944f3980ca"],
        ["etransferwithdrawal", "f8fa8e9b0457446fbaae1575c306c4ed"],
        ["etransferdeposit", "f8fa8e9b0457446fbaae1575c306c4ed"],
    ]));
    const types = new Map<string, string>([
        ["Fast Food (Quick Service)", "food"],
        ["Restaurants", "food"],
        ["Groceries", "misc"],
        ["Subscriptions & Media", "sub"],
        ["TV, Phone & Internet", "sub"],
        ["Music and Apps", "sub"],
        ["etransferwithdrawal", "etransferwithdrawal"],
        ["etransferdeposit", "etransferdeposit"],
    ])
    const relation_id = parents.get(date.getMonth())?.get(types.get(category) || "misc")
    const categories = new Map<string, string>([
        ["Fast Food (Quick Service)", "Food"],
        ["Restaurants", "Food"],
        ["Groceries", "Groceries"],
        ["Subscriptions & Media", "Subscription"],
        ["TV, Phone & Internet", "Subscription"],
        ["Music and Apps", "Subscription"],
        ["etransferdeposit", "Etransfer Deposit"],
        ["etransferwithdrawal", "Etransfer Withdrawal"]
    ])
    const category_name = categories.get(category);
    // if relation_id is null, create that group
    if (relation_id == null) {
        console.log("relation_id is null")
    }
    if (name == "UW WATCARD 519-888-4567 ON") {
        return null;
    }

    if (category == "etransfer") {

    } else {

    }
    const response = await notion.pages.create(
        JSON.parse(
            JSON.stringify({
                "parent": {
                    "type": "database_id",
                    "database_id": notionDatabaseId,
                },
                "properties": {
                    "Expense": {
                        "type": "title",
                        "title": [
                            {
                                "type": "text",
                                "text": {
                                    "content": name,
                                }
                            }
                        ]
                    },
                    "Amount": {
                        "type": "number",
                        "number": amount
                    },
                    "Parent item": {
                        "id": "Ik%7Cd",
                        "type": "relation",
                        "relation": [
                            {
                                "id": relation_id
                            }
                        ],
                        "has_more": false
                    },
                    "Date": {
                        "type": "date",
                        "date": {
                            "start": date.toISOString().slice(0, 10)
                        }
                    },
                    "Category": {
                        "type": "select",
                        "select": {
                            "name": category_name || "Misc"
                        }
                    }
                }
            })
        )
    );
    return response;
}


// Require an async function here to support await with the DB query
const server = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    switch (req.url) {
        case "/":
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });

            const tangerineLogLen = 8;
            const responses: Array<PartialPageObjectResponse | null> = [];

            req.on('end', async () => {
                const formData = JSON.parse(body);
                let expenses: Array<string> = [];
                let i = 0;
                switch (formData.inputType) {
                    case "tangerine":
                        expenses = formData.data.split("\n")
                        i = 0;
                        while (i < expenses.length) {
                            const date = new Date(expenses[i]);
                            date.setFullYear(2024);
                            if (expenses[i + 1][expenses[i + 1].length - 1] == "%") {
                                const name = expenses[i + 2];
                                const type = expenses[i + 3];
                                const amount = parseFloat(expenses[i + 6].slice(1));
                                const response = await addPage(name, type, date, amount);
                                responses.push(response);
                                i += tangerineLogLen
                            } else {
                                i += 6
                            }
                        }
                        break;
                    case "watcard":
                        expenses = formData.data.split("\n")
                        for (const expense of expenses) {
                            const exp = expense.split('\t')
                            let amount = parseFloat(exp[1].substring(1));
                            if (amount > 0) {
                                continue;
                            }
                            amount *= -1;
                            const date = new Date(exp[0])
                            const terminal = exp[5].split(':')[1].slice(1)
                            let name = "";
                            if (terminal.match(/FS-.{2,3} TH-./) != null) {
                                name = "tims watcard"
                            } else if (terminal.match(/STARBUCKS/) != null) {
                                name = "starbucks watcard"
                            } else {
                                name = terminal + ' ' + "watcard"
                            }
                            const category = (name == "tims watcard" || name == "starbucks watcard" || name == " FARAH FOODS watcard") ? "Fast Food (Quick Service)" : "misc"
                            // console.log(`name: ${name}, category: ${category}, date: ${date.toISOString().slice(0, 10)}, amount: ${amount}`)
                            console.log("category: " + category)
                            const response = await addPage(name, category, date, amount)
                            if (response != null) {
                                console.log("added page for " + name);
                            }
                            responses.push(response);
                            // console.log(response)
                        }
                        break;
                    case "etransfer":
                        expenses = formData.data.split("\n\n")
                        for (const expense of expenses) {
                            const exp = expense.split('\t')
                            console.log(exp)
                            const date = new Date(exp[0])
                            const details = exp[1].split('\n')
                            const person = details[0]
                            const amount = parseFloat(details[2])
                            const category = (exp[2].substring(19) == "accepted") ? "etransferwithdrawal" : "etransferdeposit"
                            const response = await addPage(person, category, date, amount);
                            responses.push(response);
                        }
                        break;
                    default:
                }
                res.end(JSON.stringify({ body: responses }))
            })

            break;

        default:
            res.setHeader("Content-Type", "application/json");
            res.writeHead(404);
            res.end(JSON.stringify({ error: "Resource not found" }));
    }
});

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});