import { Contact } from "../types/contact";
import { ContactParser, ContactParserImpl } from './contact-parser';
import { ContactFormatter, ContactFormatterImpl } from './contact-formatter';
import { expect } from "chai";


interface mock {
    input: string,
    expected: {
        formal: string,
        informal: string,
        neutral: string,
    },
    label?: string
}


const mockData: mock[] = [
    {
        input: "Herr Dr. med. Max Mustermann",
        expected: {
            formal: "Sehr geehrter Herr Dr. med. Mustermann",
            informal: "Hallo Max",
            neutral: "Guten Tag Herr Mustermann"
        }
    },
    {
        input: "Frau Dr. med. Marina Musterfrau",
        expected: {
            formal: "Sehr geehrte Frau Dr. med. Musterfrau",
            informal: "Hallo Marina",
            neutral: "Guten Tag Frau Musterfrau"
        }
    },
    {
        input: "Herr Dr. rer. nat. Max Mustermann",
        expected: {
            formal: "Sehr geehrter Herr Dr. rer. nat. Mustermann",
            informal: "Hallo Max",
            neutral: "Guten Tag Herr Mustermann"
        }
    },
    {
        input: "Herr Dr. h.c. mult. Max Mustermann",
        expected: {
            formal: "Sehr geehrter Herr Dr. h.c. mult. Mustermann",
            informal: "Hallo Max",
            neutral: "Guten Tag Herr Mustermann"
        }
    },
    {
        input: "Herr Prof. Max Mustermann",
        expected: {
            formal: "Sehr geehrter Herr Prof. Mustermann",
            informal: "Hallo Max",
            neutral: "Guten Tag Herr Mustermann"
        }
    },
    {
        input: "Professor Max Mustermann",
        expected: {
            formal: "Sehr geehrter Herr Prof. Mustermann",
            informal: "Hallo Max",
            neutral: "Guten Tag Herr Mustermann"
        }
    },
    {
        input: "Professorin Marina Musterfrau",
        expected: {
            formal: "Sehr geehrte Frau Prof. Musterfrau",
            informal: "Hallo Marina",
            neutral: "Guten Tag Frau Musterfrau"
        }
    },
    {
        input: "Herr Dr. med. Dr. rer. nat. Max Mustermann",
        expected: {
            formal: "Sehr geehrter Herr Dr. med. Dr. rer. nat. Mustermann",
            informal: "Hallo Max",
            neutral: "Guten Tag Herr Mustermann"
        }
    },
    {
        input: "Frau Dr. med. Dr. rer. nat. Marina Musterfrau",
        expected: {
            formal: "Sehr geehrte Frau Dr. med. Dr. rer. nat. Musterfrau",
            informal: "Hallo Marina",
            neutral: "Guten Tag Frau Musterfrau"
        }
    },
    {
        input: "Herr Dr. med. Dr. rer. nat. Dr. h.c. mult. Max Mustermann",
        expected: {
            formal: "Sehr geehrter Herr Dr. med. Dr. rer. nat. Dr. h.c. mult. Mustermann",
            informal: "Hallo Max",
            neutral: "Guten Tag Herr Mustermann"
        }
    },
    {
        input: "Herr Max Mustermann",
        expected: {
            formal: "Sehr geehrter Herr Mustermann",
            informal: "Hallo Max",
            neutral: "Guten Tag Herr Mustermann"
        }
    },
    {
        input: "Frau Marina Musterfrau",
        expected: {
            formal: "Sehr geehrte Frau Musterfrau",
            informal: "Hallo Marina",
            neutral: "Guten Tag Frau Musterfrau"
        }
    },
    {
        input: "Herr Max Muster-mann",
        expected: {
            formal: "Sehr geehrter Herr Muster-mann",
            informal: "Hallo Max",
            neutral: "Guten Tag Herr Muster-mann"
        }
    },
    {
        input: "Frau Marina Muster-frau",
        expected: {
            formal: "Sehr geehrte Frau Muster-frau",
            informal: "Hallo Marina",
            neutral: "Guten Tag Frau Muster-frau"
        }
    },
    {
        input: "Herr Max Muster-mann-frau",
        expected: {
            formal: "Sehr geehrter Herr Muster-mann-frau",
            informal: "Hallo Max",
            neutral: "Guten Tag Herr Muster-mann-frau"
        }
    },
    {
        input: "Frau Marina Muster-frau-mann",
        expected: {
            formal: "Sehr geehrte Frau Muster-frau-mann",
            informal: "Hallo Marina",
            neutral: "Guten Tag Frau Muster-frau-mann"
        }
    },
    {
        input: "Max Mustermann",
        expected: {
            formal: "Sehr geehrte*r Max Mustermann",
            informal: "Hallo Max",
            neutral: "Guten Tag Max Mustermann"
        },
        label: "Simple Name"
    },
    {
        input: "Marina Musterfrau",
        expected: {
            formal: "Sehr geehrte*r Marina Musterfrau",
            informal: "Hallo Marina",
            neutral: "Guten Tag Marina Musterfrau"
        },
        label: "Simple Name"
    },
    {
        input: "Max Seifert Mustermann",
        expected: {
            formal: "Sehr geehrte*r Max Seifert Mustermann",
            informal: "Hallo Max Seifert",
            neutral: "Guten Tag Max Seifert Mustermann"
        },
        label: "Multiple Names"
    },
    {
        label: 'With Title',
        input: "Prof. Dr. Max Mustermann",
        expected: {
            formal: "Sehr geehrte*r Prof. Dr. Max Mustermann",
            informal: "Hallo Max",
            neutral: "Guten Tag Max Mustermann"
        }
    },
    {
        label: 'With Multiple Titles',
        input: "Prof. Dr. rer. nat. Max Mustermann",
        expected: {
            formal: "Sehr geehrte*r Prof. Dr. rer. nat. Max Mustermann",
            informal: "Hallo Max",
            neutral: "Guten Tag Max Mustermann"
        }
    },
    {
        label: 'With Multiple Names and Titles',
        input: "Prof. Dr. rer. nat. Max Seifert Mustermann",
        expected: {
            formal: "Sehr geehrte*r Prof. Dr. rer. nat. Max Seifert Mustermann",
            informal: "Hallo Max Seifert",
            neutral: "Guten Tag Max Seifert Mustermann"
        }
    },
    {
        label: 'Infer Male Gender from Professor',
        input: "Professor Dr. rer. nat. Max Seifert Mustermann",
        expected: {
            formal: "Sehr geehrter Herr Prof. Dr. rer. nat. Mustermann",
            informal: "Hallo Max Seifert",
            neutral: "Guten Tag Herr Mustermann"
        }
    },
    {
        label: 'Infer Female Gender from Professorin',
        input: "Professorin Dr. rer. nat. Marianne Seifert Mustermann",
        expected: {
            formal: "Sehr geehrte Frau Prof. Dr. rer. nat. Mustermann",
            informal: "Hallo Marianne Seifert",
            neutral: "Guten Tag Frau Mustermann"
        }
    }
]


describe('Contact-Formatter', () => {

    let parser: ContactParserImpl;
    beforeEach(() => {
        parser = new ContactParserImpl();
    });

    mockData.forEach((data) => {
        it(`${data.input} should be correctly parsed and formatted`, ()=>{
            
            const parsed: Contact = parser.parse(data.input);
            const formatter: ContactFormatter = new ContactFormatterImpl(parsed);

            const result = {
                formal: formatter.formatFormal(),
                informal: formatter.formatInformal(),
                neutral: formatter.formatNeutral()
            }

            expect(result).to.deep.equal(data.expected);

        })
    });

});