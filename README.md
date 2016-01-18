
# What's the Weather?

Fetches the weather for select cities.

### How to use
* Enter a city into the input area.
* Choose between metric (Celsius) and imperial (Fahrenheit) units.

### Deployment instructions
1. Get the repository, either via `git` or by downloading a zip file.
2. Navigate to the root directory and run `npm install`.
3. Execute `webpack -w` from the root directory of the project.
3. Fire up a web server, with the `public\` directory as the web home directory.

### To dos
1. Add a loader to indicate that we're waiting on data following submission of the city.
2. Currently displays the time of the most recent report.  It should be clearer that this is an "as of" time.
3. Add the current local time.
