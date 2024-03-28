it('should be able to access related font variables using inherited rules', () => {
    expect(Object.keys(new MasterCSS().Rules.find(({ id }) => id === 'font')?.variables || {})).toEqual([
        // font-family
        'mono',
        'sans',
        'serif',
        // font-weight
        'thin',
        'extralight',
        'light',
        'regular',
        'medium',
        'semibold',
        'bold',
        'extrabold',
        'heavy'
    ])
})