export const updatedAtFormat = 'M/DD/YY';
export const defaultNoteTitle = 'Untitled Note';
export const testNotes = [
    {
        _id: 'titledNote',
        title: 'Test title 1',
        body: '',
        updatedAt: 0,
        userId: 'userId1'
    }, 
    {
        _id: 'untitledNote',
        title: '',
        body: 'Document 2 body',
        updatedAt: 0,
        userId: 'userId2'
    }
];

export default {
    updatedAtFormat,
    defaultNoteTitle,
    testNotes
};
