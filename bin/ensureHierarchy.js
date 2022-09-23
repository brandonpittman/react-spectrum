/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

function isError(node) {
  return node.source.value.includes('@react-spectrum') && !node.source.value.includes('test-utils') && !node.source.value.includes('story-utils');
}

module.exports = function (context) {
  return {
    ImportDeclaration(node) {
      let filename = context.getFilename();
      if (filename.includes('@react-stately') || filename.match(/\/test\//) != null || filename.match(/\/stories\//) != null) {
        return;
      }
      let scopeRX = /(@.*?)\//;
      let results = scopeRX.exec(context.getFilename());
      if (results) {
        let scope = results[1];
        if (scope === '@react-stately' && node.source.value.includes('@react-aria')) {
          if (node.source.value.includes('@react-aria')) {
            context.report(node, 'Cannot use @react-aria inside @react-stately.');
          } else if (node.source.value.includes('@react-spectrum') && isError(node)) {
            context.report(node, 'Cannot use @react-spectrum inside @react-stately.');
          }
        }
        if (scope === '@react-aria' && isError(node)) {
          context.report(node, 'Cannot use @react-spectrum inside @react-aria.');
        }
      }
    }
  };
};
