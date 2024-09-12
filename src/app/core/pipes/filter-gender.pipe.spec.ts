import { FilterGenderPipe } from './filter-gender.pipe';

fdescribe('FilterGenderPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterGenderPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return empty array if null is passed as a param', () => {
    const pipe = new FilterGenderPipe();
    expect(pipe.transform(null as unknown as Movie[], '')).toEqual([]);
  });

  it('should return empty array if null is passed as a param', () => {
    const pipe = new FilterGenderPipe();
    const movies: Movie[] = [
      { title: 'Ação 1', gender: 'Ação' } as Movie,
      { title: 'Terror 1', gender: 'Terror' } as Movie,
      { title: 'Ação 2', gender: 'Ação' } as Movie,
      { title: 'Terror 2', gender: 'Terror' } as Movie,
      { title: 'Ação 3', gender: 'Ação' } as Movie,
    ];
    const result = pipe.transform(movies, 'Ação');
    expect(result.length).toEqual(3);
  });
});
