import axios from "axios";
import httpAdapter from "axios/lib/adapters/http";

// In order for `nock` and `axios` to work together, the adapter has to be
// manually specified. See the following issue:
// https://github.com/axios/axios/issues/305
axios.defaults.adapter = httpAdapter;
