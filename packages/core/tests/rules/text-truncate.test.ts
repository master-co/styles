test('text-truncate', () => {
    expect(new MasterCSS().create('text-truncate:3')?.text).toBe('.text-truncate\\:3{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden;overflow-wrap:break-word;text-overflow:ellipsis}')
    expect(new MasterCSS().create('lines:3')?.text).toBe('.lines\\:3{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden;overflow-wrap:break-word;text-overflow:ellipsis}')
})
