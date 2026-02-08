import type { Course } from '../types';

export const CATEGORIES = {
    'Business & Accounting': ['ACCTG', 'FINAN', 'MGT', 'MKTG', 'OSC'],
    'Technology & Engineering': ['COMP', 'CS', 'ECE', 'IS'],
    'Arts & Media': ['ART', 'COMM', 'FILM', 'GAMES', 'MUSC'],
    'Sciences': ['BIOL', 'CHEM', 'PHYS', 'PSY'],
    'Humanities & General': ['CHIN', 'CMP', 'HIST', 'HONOR', 'KOREA', 'MATH', 'POLS', 'QUEST', 'RELS', 'UGS', 'WRTG']
};

export const coursesData: Course[] = [
    // Business & Accounting
    {
        id: '1',
        code: 'ACCTG 2100',
        name: 'Introduction to Financial Accounting',
        instructor: 'John Doe',
        days: ['Mo', 'We'],
        startTime: '09:00',
        endTime: '10:15',
        room: 'BMSB 101',
        status: 'Open',
        attributes: ['QI'],
        category: 'Business & Accounting',
        prefix: 'ACCTG'
    },
    {
        id: '2',
        code: 'FINAN 3040',
        name: 'Financial Management',
        instructor: 'Jane Smith',
        days: ['Tu', 'Th'],
        startTime: '10:30',
        endTime: '11:45',
        room: 'BMSB 202',
        status: 'Open',
        attributes: [],
        category: 'Business & Accounting',
        prefix: 'FINAN'
    },
    // Technology & Engineering
    {
        id: '3',
        code: 'CS 1410',
        name: 'Introduction to Object-Oriented Programming',
        instructor: 'Alan Turing',
        days: ['Mo', 'We', 'Fr'],
        startTime: '13:00',
        endTime: '13:50',
        room: 'WEB L104',
        status: 'Closed',
        attributes: ['QI'],
        category: 'Technology & Engineering',
        prefix: 'CS'
    },
    {
        id: '4',
        code: 'CS 2420',
        name: 'Intro to Algorithms',
        instructor: 'Donald Knuth',
        days: ['Tu', 'Th'],
        startTime: '14:00',
        endTime: '15:20',
        room: 'WEB L101',
        status: 'Open',
        attributes: ['QI'],
        category: 'Technology & Engineering',
        prefix: 'CS'
    },
    {
        id: '5',
        code: 'ECE 2240',
        name: 'Introduction to Electric Circuits',
        instructor: 'Nikola Tesla',
        days: ['Mo', 'We'],
        startTime: '15:00',
        endTime: '16:15',
        room: 'MEB 1200',
        status: 'Open',
        attributes: [],
        category: 'Technology & Engineering',
        prefix: 'ECE'
    },
    // Arts & Media
    {
        id: '6',
        code: 'ART 1010',
        name: 'Introduction to Visual Arts',
        instructor: 'Vincent van Gogh',
        days: ['Fr'],
        startTime: '09:00',
        endTime: '12:00',
        room: 'ART 101',
        status: 'Open',
        attributes: ['FF'],
        category: 'Arts & Media',
        prefix: 'ART'
    },
    {
        id: '7',
        code: 'COMM 1010',
        name: 'Introduction to Communication',
        instructor: 'Emma Watson',
        days: ['Tu', 'Th'],
        startTime: '08:30',
        endTime: '09:45',
        room: 'LNCO 1100',
        status: 'Open',
        attributes: ['CW'],
        category: 'Arts & Media',
        prefix: 'COMM'
    },
    // Sciences
    {
        id: '8',
        code: 'BIOL 1010',
        name: 'General Biology',
        instructor: 'Charles Darwin',
        days: ['Mo', 'We', 'Fr'],
        startTime: '11:00',
        endTime: '11:50',
        room: 'ASB 210',
        status: 'Open',
        attributes: [],
        category: 'Sciences',
        prefix: 'BIOL'
    },
    {
        id: '9',
        code: 'PSY 1010',
        name: 'General Psychology',
        instructor: 'Sigmund Freud',
        days: ['Tu', 'Th'],
        startTime: '12:00',
        endTime: '13:15',
        room: 'BEHS 102',
        status: 'Open',
        attributes: [],
        category: 'Sciences',
        prefix: 'PSY'
    },
    // Humanities & General
    {
        id: '10',
        code: 'MATH 1210',
        name: 'Calculus I',
        instructor: 'Isaac Newton',
        days: ['Mo', 'Tu', 'We', 'Th', 'Fr'],
        startTime: '08:00',
        endTime: '08:50',
        room: 'JWB 335',
        status: 'Open',
        attributes: ['QI'],
        category: 'Humanities & General',
        prefix: 'MATH'
    },
    {
        id: '11',
        code: 'HIST 1700',
        name: 'American Civilization',
        instructor: 'George Washington',
        days: ['Mo', 'We'],
        startTime: '14:00',
        endTime: '15:15',
        room: 'CSH 101',
        status: 'Open',
        attributes: [],
        category: 'Humanities & General',
        prefix: 'HIST'
    }
];
