export const simplify = (expenses) => {
  let paidto = {};
  let paidfrom = {};

  expenses.map((transaction) => {
    let sum = 0;
    transaction.paidFor.map((item) => {
      sum += item.amount;
      if (item.person in paidto) {
        paidto[item.person] += item.amount;
      } else {
        paidto[item.person] = item.amount;
      }
    });
    if (transaction.paidBy in paidfrom) {
      paidfrom[transaction.paidBy] += sum;
    } else {
      paidfrom[transaction.paidBy] = sum;
    }
  });

  for (let person in paidto) {
    if (person in paidfrom) {
      if (paidfrom[person] <= paidto[person]) {
        paidto[person] -= paidfrom[person];

        delete paidfrom[person];
      } else {
        paidfrom[person] -= paidto[person];
        paidto[person] = 0;
      }
    }
  }

  for (let person in paidfrom) {
    if (person in paidto) {
      if (paidto[person] <= paidfrom[person]) {
        paidfrom[person] -= paidto[person];

        delete paidto[person];
      } else {
        paidto[person] -= paidfrom[person];
        paidfrom[person] = 0;
      }
    }
  }
  let lst = [];

  for (let person1 in paidto) {
    for (let person2 in paidfrom) {
      if (paidto[person1] >= paidfrom[person2])
        console.log(person1, "owes", person2, paidfrom[person2]);
      lst.push(`${person1} owes ${person2} amount ${paidfrom[person2]}`);
      paidto[person1] -= paidfrom[person2];
      paidfrom[person2] = 0;
    }
  }
  return lst;
};

export const convert = (split) => {
  let expenses = [];
  split.map((expense) => {
    let count = expense.amount / expense.to.length;
    let obj = {
      paidBy: expense.by,
      paidFor: [],
    };
    expense.to.map((user) => {
      if (user != obj.paidBy) {
        let x = {
          person: user,
          amount: count,
        };
        obj.paidFor.push(x);
      }
    });
    expenses.push(obj);
  });
  return expenses;
};

// let split = [
//   {
//     by: "A",
//     tag: "",
//     amount: 150,
//     to: ["A", "B", "C"],
//   },

//   {
//     by: "A",
//     tag: "",
//     amount: 500,
//     to: ["C"],
//   },
// ];

// convert(split);

// let expenses1 = [
//   {
//     paidBy: "A",
//     paidFor: [
//       { person: "B", amount: 100 },
//       { person: "C", amount: 50 },
//     ],
//   },
//   { paidBy: "A", paidFor: [{ person: "C", amount: 500 }] },
//   {
//     paidBy: "B",
//     paidFor: [
//       { person: "A", amount: 150 },
//       { person: "C", amount: 200 },
//     ],
//   },
//   {
//     paidBy: "C",
//     paidFor: [
//       { person: "A", amount: 250 },
//       { person: "B", amount: 200 },
//     ],
//   },
// ];

// simplify(expenses1);
