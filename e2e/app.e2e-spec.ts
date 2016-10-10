import { NinegagPage } from './app.po';

describe('ninegag App', function() {
  let page: NinegagPage;

  beforeEach(() => {
    page = new NinegagPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
