# Spinner

Spinner, which attaches to a DOM-node.  
Use: `spinner(options)`

## Options object

| Setting      | Possible values                       |
| :----------- | :------------------------------------ |
| clsInner     | Class for inner spinner               |
| clsSpinner   | Class for outer spinner               |
| clsText      | Class for text                        |
| clsWrapper   | Class for main wrapper                |
| console      | Boolean. Show status in console       |
| displayText  | Boolean. Show/hide text               |
| removeOnDone | Boolean. Remove node when show(false) |
| target       | querySelector for target DOM node     |
| text         | Text for aria-label and text          |

## Defaults

- `console` (false)
- `displayText` (false)
- `removeOnDone` (false)
- `target` ('body')
- `text` ('Loading')

Text is not displayed by default, but is announced to screen-readers using `aria-label`.

## Built-in Styles (if using `spinner.css`)

### Wrapper (`clsWrapper`)

- `c-spinner--inline`
- `c-spinner--overlay` (default)

### Spinner (`clsSpinner`)

- `c-spinner__apple`
- `c-spinner__bars`
- `c-spinner__circle` (default)
- `c-spinner__dots`

To scale the spinner, use it with a modifier-class, setting `font-size`:

- `c-spinner--xxl` (default)

### Inner spinner (`clsInner`)

- `c-spinner__inner` (default)

### Text

- `c-spinner__text` (default)

## Examples

By default, if importing the CSS in `<head>`:

```html
<link href="spinner.css" rel="stylesheet" />
```

And applying this JavaScript in `<script type="module">`:

```js
import Spinner from './spinner.mjs';
const spinner = new Spinner();
```

You'll get a full-screen overlay (`c-spinner--overlay`) with a circular spinner (`c-spinner__circle`).

Show it by using `spinner.show(true)`  
Hide it by using `spinner.show(false)`

To output status to the `console`:

```js
const spinner = new Spinner({ console: true });
```

To create an _inline_ spinner on a button with id `myButton`:

```js
const spinner = new Spinner({
  {
    clsSpinner: 'c-spinner__apple',
    clsWrapper: 'c-spinner--inline',
    target: '#myButton'
  }
});
```

## Using with `goand`

```js
const spinner = new Spinner();

goand('//httpstat.us/500?sleep=5000', {
  mode: 'cors',
  spinner: spinner.show
}).then(data => {
  console.log(data);
});
```
