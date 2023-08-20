import type { TweetModel } from '$/commonTypesWithClient/models';
import { OPENAIAPI, TWITTER_PASSWORD, TWITTER_USERNAME } from '$/service/envValues';
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from 'openai';
import type { Browser, BrowserContext, Page } from 'playwright';
import { chromium } from 'playwright';

const configuration = new Configuration({
  apiKey: OPENAIAPI,
});
const openai = new OpenAIApi(configuration);

const GPT = async () => {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: ChatCompletionRequestMessageRoleEnum.User,
          content: '簡単で面白いことを言ってください',
        },
      ],
    });
    const answer = response.data.choices[0].message?.content;
    console.log(answer);
    if (answer !== undefined) {
      return answer;
    }
  } catch (error) {
    console.log(error);
  }
};

const origin = 'https://twitter.com';

let browser: Browser | null = null;
let context: BrowserContext | null = null;
let page: Page | null = null;

const getLoggedInPage = async () => {
  if (page?.isClosed() === false) return page;

  browser = await chromium.launch({ headless: false });
  context = await browser.newContext({ locale: 'ja-JP' });
  page = await context.newPage();

  await page.goto(origin);
  await page.getByTestId('loginButton').click();
  await page.locator('input[autocomplete="username"]').fill(TWITTER_USERNAME);
  await page.getByText('次へ').click();
  await page.locator('input[name="password"]').fill(TWITTER_PASSWORD);
  await page.getByTestId('LoginForm_Login_Button').click();
  await page.getByTestId('SideNav_NewTweet_Button').waitFor();

  return page;
};

export const twitterRepository = {
  //   fetchTrends: async (): Promise<TrendModel[]> => {
  //     const page = await getLoggedInPage();

  //     await page.goto(`${origin}/explore/tabs/trending`);

  //     const selector = '[data-testid="trend"] > div > div:nth-child(2)';
  //     await page.waitForSelector(selector);

  //     return page
  //       .locator(selector)
  //       .allInnerTexts()
  //       .then((trends) =>
  //         trends.map((t): TrendModel => ({ isHashtag: t.startsWith('#'), word: t.replace('#', '') }))
  //       );
  //   },

  fetchTweet: async (): Promise<TweetModel[]> => {
    const page = await getLoggedInPage();
    // await page.goto(`${origin}/home`);

    const tweetTextox = await page.getByRole('textbox', { name: 'Tweet text' });
    await tweetTextox.click();

    // const contents = 'aaaa';
    const contents = await GPT();
    if (contents !== undefined) {
      await tweetTextox.fill(contents);

      await page.getByTestId('tweetButtonInline').click();

      return [{ isHashtag: false, content: contents }];
    } else {
      return [{ isHashtag: false, content: 'GPTは生成できませんでした' }];
    }
  },
};
