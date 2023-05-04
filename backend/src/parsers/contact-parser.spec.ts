import { expect } from 'chai';
import { Contact } from '../types/contact';
import { ContactParser, ContactParserImpl } from './contact-parser';

interface mock {
    input: string,
    expected: Contact,
    label?: string
}

const titleMockData: mock[] = [
    {
        input: "Herr Dr. med. Max Mustermann",
        expected: {
            gender: 'm',
            titles: ['Dr. med.'],
            name: 'Max',
            surname: 'Mustermann'
        }
    },
    {
        input: "Frau Dr. med. Marina Musterfrau",
        expected: {
            gender: 'w',
            titles: ['Dr. med.'],
            name: 'Marina',
            surname: 'Musterfrau'
        }
    },
    {
        input: "Herr Dr. rer. nat. Max Mustermann",
        expected: {
            gender: 'm',
            titles: ['Dr. rer. nat.'],
            name: 'Max',
            surname: 'Mustermann'
        }
    },
    {
        input: "Herr Dr. h.c. mult. Max Mustermann",
        expected: {
            gender: 'm',
            titles: ['Dr. h.c. mult.'],
            name: 'Max',
            surname: 'Mustermann'
        }
    },
    {
        input: "Herr Prof. Max Mustermann",
        expected: {
            gender: 'm',
            titles: ['Prof.'],
            name: 'Max',
            surname: 'Mustermann'
        }
    },
    {
        input: "Professor Max Mustermann",
        expected: {
            gender: 'm',
            titles: ['Prof.'],
            name: 'Max',
            surname: 'Mustermann'
        }
    },
    {
        input: "Professorin Marina Musterfrau",
        expected: {
            gender: 'w',
            titles: ['Prof.'],
            name: 'Marina',
            surname: 'Musterfrau'
        }
    },
];

const multipleTitleMockData: mock[] = [
    {
        input: "Herr Dr. med. Dr. rer. nat. Max Mustermann",
        expected: {
            name: 'Max',
            surname: 'Mustermann',
            titles: ['Dr. med.', 'Dr. rer. nat.'],
            gender: 'm'
        }
    },
    {
        input: "Frau Dr. med. Dr. rer. nat. Marina Musterfrau",
        expected: {
            name: 'Marina',
            surname: 'Musterfrau',
            titles: ['Dr. med.', 'Dr. rer. nat.'],
            gender: 'w' 
        }
    },
    {
        input: "Herr Dr. med. Dr. rer. nat. Dr. h.c. mult. Max Mustermann",
        expected: {
            name: 'Max',
            surname: 'Mustermann',
            titles: ['Dr. med.', 'Dr. rer. nat.', 'Dr. h.c. mult.'],
            gender: 'm'
        }
    }
];

const simpleNameMockData: mock[] = [
    {
        input: "Herr Max Mustermann",
        expected: {
            gender: 'm',
            name: 'Max',
            surname: 'Mustermann',
            titles: []
        }
    },
    {
        input: "Frau Marina Musterfrau",
        expected: {
            gender: 'w',
            name: 'Marina',
            surname: 'Musterfrau',
            titles: []
        }
    },
];

const multipleSurNamesMockData: mock[] = [
    {
        input: "Herr Max Muster-mann",
        expected: {
            gender: 'm',
            name: 'Max',
            surname: 'Muster-mann',
            titles: []
        }
    },
    {
        input: "Frau Marina Muster-frau",
        expected: {
            gender: 'w',
            name: 'Marina',
            surname: 'Muster-frau',
            titles: []
    }
    },
    {
        input: "Herr Max Muster-mann-frau",
        expected: {
            gender: 'm',
            name: 'Max',
            surname: 'Muster-mann',
            titles: []
        }
    },
    {
        input: "Frau Marina Muster-frau-mann",
        expected: {
            gender: 'w',
            name: 'Marina',
            surname: 'Muster-frau',
            titles: []
    }
    },
];

const multipleNamesMockData: mock[] = [
    {
        input: "Herr Max Seifert Mustermann",
        expected: {
            gender: 'm',
            name: 'Max Seifert',
            surname: 'Mustermann',
            titles: []
        }
    },
    {
        input: "Frau Marina Seifert Musterfrau",
        expected: {
            gender: 'w',
            name: 'Marina Seifert',
            surname: 'Musterfrau',
            titles: []
    }
    },
    {
        input: "Herr Max Seifert Simon Eduard Mustermann",
        expected: {
            name: 'Max Seifert Simon Eduard',
            surname: 'Mustermann',
            titles: [],
        }
    }
]


const multipleNamesWithTitleMockData: mock[] = [
    {
        input: "Herr Prof. Dr. Max Seifert Mustermann",
        expected: {
            gender: 'm',
            name: 'Max Seifert',
            surname: 'Mustermann',
            titles: ["Prof.", "Dr."]
        }
    },
    {
        input: "Frau Prof. Dr. rer. nat. Marina Seifert Musterfrau",
        expected: {
            gender: 'w',
            name: 'Marina Seifert',
            surname: 'Musterfrau',
            titles: ["Prof.", "Dr. rer. nat."]
    }
    },
    {
        input: "Herr Prof. Dr. rer. nat. Max Seifert Simon Eduard Mustermann",
        expected: {
            name: 'Max Seifert Simon Eduard',
            surname: 'Mustermann',
            titles: ["Prof.", "Dr. rer. nat."],
            gender: 'm'
    }
}
]

const genderlessData: mock[] = [
    {
        input: "Max Mustermann",
        expected: {
            name: 'Max',
            surname: 'Mustermann',
            titles: [],
        },
        label: "Simple Name"
    },
    {
        input: "Marina Musterfrau",
        expected: {
            name: 'Marina',
            surname: 'Musterfrau',
            titles: [],
        },
        label: "Simple Name"
    },
    {
        input: "Max Seifert Mustermann",
        expected: {
            name: 'Max Seifert',
            surname: 'Mustermann',
            titles: [],
        },
        label: "Multiple Names"
    },
    {
        label: 'With Title',
        input: "Prof. Dr. Max Mustermann",
        expected: {
            name: 'Max',
            surname: 'Mustermann',
            titles: ["Prof.", "Dr."],
        }
    },
    {
        label: 'With Multiple Titles',
        input: "Prof. Dr. rer. nat. Max Mustermann",
        expected: {
            name: 'Max ',
            surname: 'Mustermann',
            titles: ["Prof.", "Dr. rer. nat."],
        }
    },
    {
        label: 'With Multiple Names and Titles',
        input: "Prof. Dr. rer. nat. Max Seifert Mustermann",
        expected: {
            name: 'Max Seifert',
            surname: 'Mustermann',
            titles: ["Prof.", "Dr. rer. nat."],
        }
    },
    {
        label: 'Infer Male Gender from Professor',
        input: "Professor Dr. rer. nat. Max Seifert Mustermann",
        expected: {
            name: 'Max Seifert',
            surname: 'Mustermann',
            titles: ["Prof.", "Dr. rer. nat."],
            gender: 'm'
        }
    },
    {
        label: 'Infer Female Gender from Professorin',
        input: "Professorin Dr. rer. nat. Marianne Seifert Mustermann",
        expected: {
            name: 'Marianne Seifert',
            surname: 'Mustermann',
            titles: ["Prof.", "Dr. rer. nat."],
            gender: 'w'
        }
    }
]


describe('ContactParser parses correctly for good Input with Titles', () => {

    let parser: ContactParser;
    
    beforeEach(() => {
        parser = getTestParser()
    });

    it('tests if the checks are done correctly', () => {
        const mock1: Contact = {
            name: 'Max',
            surname: 'Mustermann',
            titles: ["Prof.", "Dr. rer. nat."],
            gender: 'm'
        }
        const mock1Copy: Contact = {
            name: 'Max',
            surname: 'Mustermann',
            titles: ["Prof.", "Dr. rer. nat."],
            gender: 'm'
        }
        const mock2: Contact = {
            name: 'Max',
            surname: 'Musterfrau',
            titles: ["Prof.", "Dr. rer. nat."],
            gender: 'm'
        }

        expect(mock1).to.deep.equal(mock1Copy);
        expect(mock1).to.not.deep.equal(mock2);
        
    });

    titleMockData.forEach((mock) => {
        it(`should parse "${mock.input}" correctly`, () => {
            expect(parser.parse(mock.input)).to.deep.equal(mock.expected);
        }
        );
    });
});

describe('ContactParser parses correctly for good Input with Multiple Titles', () => {

    let parser: ContactParser;

    beforeEach(() => {
        parser = getTestParser()
    });

    multipleTitleMockData.forEach((mock) => {
        it(`should parse "${mock.input}" correctly`, () => {
            expect(parser.parse(mock.input)).to.deep.equal(mock.expected);
        }
        );
    });
});

describe('ContactParser parses correctly for good Input with Simple Names', () => {

    let parser: ContactParser;

    beforeEach(() => {
        parser = getTestParser()
    });

    simpleNameMockData.forEach((mock) => {
        it(`should parse "${mock.input}" correctly`, () => {
            expect(parser.parse(mock.input)).to.deep.equal(mock.expected);
        }
        );
    });
});

describe('ContactParser parses correctly for good Input with multiple Surnames', () => {

    let parser: ContactParser;

    beforeEach(() => {
        parser = getTestParser()
    });

    multipleSurNamesMockData.forEach((mock) => {
        it(`should parse "${mock.input}" correctly`, () => {
            expect(parser.parse(mock.input)).to.deep.equal(mock.expected);
        }
        );
    });
});

describe('ContactParser parses correctly for good Input with multiple names', () => {

    let parser: ContactParser;

    beforeEach(() => {
        parser = getTestParser()
    });

    multipleNamesMockData.forEach((mock) => {
        it(`should parse "${mock.input}" correctly`, () => {
            expect(parser.parse(mock.input)).to.deep.equal(mock.expected);
        }
        );
    });
});

describe('ContactParser parses correctly for good Input with multiple names and titles', () => {

    let parser: ContactParser;

    beforeEach(() => {
        parser = getTestParser()
    });

    multipleNamesMockData.forEach((mock) => {
        it(`should parse "${mock.input}" correctly`, () => {
            expect(parser.parse(mock.input)).to.deep.equal(mock.expected);
        }
        );
    });
});


describe('ContactParser parses correctly for good Input with unabigious gender', () => {

    let parser: ContactParser;

    beforeEach(() => {
        parser = getTestParser()
    });

    genderlessData.forEach((mock) => {
        it(`should parse "${mock.input}" correctly`, () => {
            expect(parser.parse(mock.input)).to.deep.equal(mock.expected);
        }
        );
    });
});

describe('ContactParser can receive new title and parse correctly', () => {

    let parser: ContactParser;

    beforeEach(() => {
        parser = getTestParser()
    });

    it('should add a new title without an error', (done)=>{
        const title = "Sack";
        parser.addTitle(title);
        done();
    });

    it('should parse a new title correctly', () => {
        const title = "Sack";
        parser.addTitle(title);
        expect(parser.parse("Herr Sack Raphael Sack")).to.deep.equal({
            name: 'Raphael',
            surname: 'Sack',
            titles: [title],
            gender: 'm'
        });
    }); 

});

function getTestParser(): ContactParser {
    return new ContactParserImpl();
}
