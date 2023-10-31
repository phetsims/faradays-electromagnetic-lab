#!/bin/bash
#=======================================================================================================================
#
# Converts a CSV file of B-field values to a number[][] that can be pasted into JavaScript code.

# Usage: csvToArray.sh ../data/bfield/BX_internal.csv
#
# NOTE: You will need to remove the final ',' at the end of the output.
#
#=======================================================================================================================

filename="$1"
echo "["
cat "$filename" | tr -d '\r' | while read -r line; do
  echo "[ $line ],"
done
echo "]"