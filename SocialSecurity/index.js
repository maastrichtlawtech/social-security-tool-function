const https = require('https');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // RESIDENCY ZONE
    const residency = req.body.residency;
    const res_country = residency[0] ? residency[0].country : residency.country;

    // WORK ZONE
    // Get the percentage of working hours for each place
    let add_hours = (acc, a) => acc + parseInt(a.hours);
    const total_hours = req.body.workplaces.reduce(add_hours, 0);

    // Append the percentages to the array
    let workplaces = [];
    req.body.workplaces.map(workplace => {
        workplaces.push({
            ...workplace,
            perc: workplace.hours/total_hours * 100
        })
    });

    // Get the percentages for each location
    let loc_groups = workplaces.reduce((groups, workplace) => {
        if((gr = groups.find(group => group.location === workplace.location))) {
            gr.perc += workplace.perc;
        } else {
            groups.push({
                location:workplace.location,
                perc:workplace.perc
            })
        }
        return groups;
    }, []);

    context.log(residency);
    context.log(workplaces);
    context.log(loc_groups);

    // EVALUATE
    // Civil servant - highest weight
    if((cs_workplace = workplaces.find(workplace => workplace.employment === 'Civil servant'))){
        context.res = {
            body: {
                type: "country",
                country: cs_workplace.location,
                case: "CASE CS"
            }
        };
        context.log(context.res.body);
        context.done();
        // last civil servant case ??????
    }

    // CASE 1 (see diagram)
    else if (nlab_loc = loc_groups.find(loc => loc.perc === 100)){
        context.res = {
            body: {
                type: nlab_loc.location === 'Netherlands' ? "country" : "legislation",
                country: nlab_loc.location,
                case: "CASE 1"
            }
        };
        context.log(context.res.body);
        context.done();
    }

    // CASE 3 & 4 (see diagram)
    else if ((nlem_workplace = workplaces.find(workplace => workplace.location === 'Netherlands' && workplace.employment === "Employee"))){
        // CASE 4 
        if ((workplaces.find(workplace => workplace.location !== 'Netherlands' && workplace.employment === "Employee"))){
            max_workplace = workplaces.reduce((prev, current) => (prev.perc > current.perc) ? prev : current);
            if(max_workplace.perc > 25 && max_workplace.location == res_country){
                // CASE 4.1
                context.res = {
                    body: {
                        type: "country",
                        country: res_country,
                        case: "CASE 4.1"
                    }
                };
                context.log(context.res.body);
                context.done();
            } else if (workplaces.find(workplace => workplace.union !== 'EU')){
                // CASE 4.3
                context.res = {
                    body: {
                        type: "country",
                        country: res_country,
                        case: "CASE 4.3"
                    }
                };
                context.log(context.res.body);
                context.done();
            } else {
                context.res = {
                    body: {
                        type: "legislation",
                        country: max_workplace.location,
                        case: "CASE 4.2"
                    }
                };
                context.log(context.res.body);
                context.done();
            }
        }

         // CASE 3
         if ((workplaces.find(workplace => workplace.employment === 'Self-employed'))){
            context.res = {
                body: {
                    type: "country",
                    country: nlem_workplace.location,
                    case: "CASE 3"
                }
            };
            context.log(context.res.body);
            context.done();
        }
    }

    // CASE 5 (see diagram)
    else if ((abem_workplace = workplaces.find(workplace => workplace.location !== 'Netherlands' && workplace.employment === "Employee"))){
        if ((workplaces.find(workplace => workplace.employment === 'Self-employed'))){
            context.res = {
                body: {
                    type: "legislation",
                    country: abem_workplace.location,
                    case: "CASE 5"
                }
            };
        }
        context.log(context.res.body);
        context.done();
    }

    // CASE 6 (see diagram)
    else if ((workplaces.find(workplace => workplace.location === 'Netherlands' && workplace.employment === 'Self-employed'))){
        if(workplaces.find(workplace => workplace.location !== 'Netherlands' && workplace.employment === 'Self-employed')){
            max_workplace = workplaces.reduce((prev, current) => (prev.perc > current.perc) ? prev : current);
            context.log(max_workplace)
            context.res = {
                body: {
                    type: "country",
                    country: max_workplace.location == res_country && max_workplace.perc > 25 ? res_country : max_workplace.location,
                    case: "CASE 6"
                }
            };
        }
        context.log(context.res.body);
        context.done();
    }

    context.res = {
        body: "Unknown case :("
    }
    context.log(context.res.body);
    context.done();
};